import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ---------------------------------------------------------------------------
// TTS provider chain (all zero-cost):
//   1. Groq Orpheus  — sub-200ms TTFB, warm voices, 200-char/req limit
//   2. Cloudflare Workers AI → Deepgram Aura-1  — ~7,300 chars/day free
//   3. (client fallback) browser speechSynthesis — handled in voice.ts
// ---------------------------------------------------------------------------

const ALLOWED_ORIGINS = [
  "https://thelampstand.icu",
  "https://www.thelampstand.icu",
];
const ALLOWED_LOCALHOSTS = [
  "http://localhost:8080",
  "http://localhost:5173",
  "http://localhost:3000",
];

function corsHeaders(req: Request) {
  const origin = req.headers.get("origin") ?? "";
  const allowed =
    ALLOWED_ORIGINS.includes(origin) || ALLOWED_LOCALHOSTS.includes(origin);
  return {
    "Access-Control-Allow-Origin": allowed ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    Vary: "Origin",
  };
}

// ---------------------------------------------------------------------------
// Rate limiting
// ---------------------------------------------------------------------------
const AUTH_USER_DAILY_LIMIT = 50;
const ANON_IP_DAILY_LIMIT = 10;

async function checkRateLimit(
  supabase: ReturnType<typeof createClient>,
  bucketKey: string,
  limit: number,
): Promise<{ allowed: boolean }> {
  const windowStart = new Date();
  windowStart.setHours(0, 0, 0, 0);
  try {
    const { data } = await supabase
      .from("api_rate_limits")
      .upsert(
        {
          bucket_key: bucketKey,
          endpoint: "tts",
          request_count: 1,
          window_start: windowStart.toISOString(),
        },
        { onConflict: "bucket_key,endpoint,window_start", ignoreDuplicates: false },
      )
      .select("request_count")
      .single();

    if (data && data.request_count > 1) {
      const { data: updated } = await supabase
        .from("api_rate_limits")
        .update({ request_count: data.request_count + 1 })
        .eq("bucket_key", bucketKey)
        .eq("endpoint", "tts")
        .gte("window_start", windowStart.toISOString())
        .select("request_count")
        .single();
      return { allowed: (updated?.request_count ?? data.request_count + 1) <= limit };
    }
    return { allowed: 1 <= limit };
  } catch {
    return { allowed: true };
  }
}

// ---------------------------------------------------------------------------
// Text chunking — Groq Orpheus hard limit: 200 chars per request.
// Split on sentence boundaries; never cut mid-word.
// ---------------------------------------------------------------------------
function chunkText(text: string, maxChars = 190): string[] {
  if (text.length <= maxChars) return [text];

  const chunks: string[] = [];
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [text];
  let current = "";

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;

    if ((current + " " + trimmed).trim().length <= maxChars) {
      current = (current + " " + trimmed).trim();
    } else {
      if (current) chunks.push(current);
      if (trimmed.length > maxChars) {
        // Sentence too long — split on word boundaries
        const parts = trimmed.match(/.{1,190}(\s|$)/g) ?? [trimmed];
        for (const part of parts) {
          const p = part.trim();
          if (p) chunks.push(p);
        }
        current = "";
      } else {
        current = trimmed;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks.filter((c) => c.length > 0);
}

// ---------------------------------------------------------------------------
// Voice mapping
// ---------------------------------------------------------------------------
const GROQ_VOICES: Record<string, string> = {
  male: "Troy",      // warm, grounded
  female: "Hannah",  // warm, clear
};

// Keep model ID in one place — Groq deprecates quickly (8 days notice precedent)
const GROQ_TTS_MODEL = "canopylabs/orpheus-v1-english";

const CF_AURA_VOICES: Record<string, string> = {
  male: "arcas",     // warm, grounded Deepgram voice
  female: "asteria", // warm, clear Deepgram voice
};

// ---------------------------------------------------------------------------
// Provider 1: Groq Orpheus
// Chunks text, fires sequential requests, concatenates WAV output.
// ---------------------------------------------------------------------------
async function groqTTS(
  text: string,
  voice: string,
  groqApiKey: string,
): Promise<Uint8Array | null> {
  const chunks = chunkText(text);
  const audioBuffers: ArrayBuffer[] = [];

  for (const chunk of chunks) {
    const res = await fetch("https://api.groq.com/openai/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_TTS_MODEL,
        input: chunk,
        voice: GROQ_VOICES[voice] ?? GROQ_VOICES.male,
        response_format: "wav",
      }),
    });

    if (!res.ok) {
      console.warn(`[tts] Groq chunk failed: ${res.status}`);
      return null;
    }
    audioBuffers.push(await res.arrayBuffer());
  }

  if (audioBuffers.length === 0) return null;
  if (audioBuffers.length === 1) return new Uint8Array(audioBuffers[0]);

  // Concatenate WAV: keep the first 44-byte header, strip headers from the rest
  const first = new Uint8Array(audioBuffers[0]);
  const rest = audioBuffers.slice(1).map((b) => new Uint8Array(b).slice(44));
  const totalLen = first.length + rest.reduce((s, a) => s + a.length, 0);
  const merged = new Uint8Array(totalLen);
  merged.set(first, 0);
  let offset = first.length;
  for (const chunk of rest) { merged.set(chunk, offset); offset += chunk.length; }

  // Fix WAV size fields in the header
  const view = new DataView(merged.buffer);
  view.setUint32(4, totalLen - 8, true);   // ChunkSize
  view.setUint32(40, totalLen - 44, true); // Subchunk2Size

  return merged;
}

// ---------------------------------------------------------------------------
// Provider 2: Cloudflare Workers AI → Deepgram Aura-1
// ~7,300 chars/day on free 10k-neuron allocation; callable via REST.
// ---------------------------------------------------------------------------
async function workersAiTTS(
  text: string,
  voice: string,
  cfAccountId: string,
  cfApiToken: string,
): Promise<Uint8Array | null> {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/ai/run/@cf/deepgram/aura-1`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfApiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text.slice(0, 2000), // Deepgram-inherited per-request cap
        voice: CF_AURA_VOICES[voice] ?? CF_AURA_VOICES.male,
      }),
    },
  );

  if (!res.ok) {
    console.warn(`[tts] Workers AI Aura-1 failed: ${res.status}`);
    return null;
  }
  return new Uint8Array(await res.arrayBuffer());
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------
serve(async (req) => {
  const cors = corsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
  const CF_ACCOUNT_ID = Deno.env.get("CLOUDFLARE_ACCOUNT_ID");
  const CF_API_TOKEN = Deno.env.get("CLOUDFLARE_API_TOKEN");
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Rate limiting
  const authHeader = req.headers.get("Authorization");
  let bucketKey: string;
  let rateLimit: number;
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const { data: { user } } = await supabase.auth.getUser(authHeader.slice(7));
      bucketKey = user?.id
        ? `user:${user.id}`
        : `ip:${req.headers.get("x-forwarded-for") ?? "unknown"}`;
      rateLimit = user?.id ? AUTH_USER_DAILY_LIMIT : ANON_IP_DAILY_LIMIT;
    } catch {
      bucketKey = `ip:${req.headers.get("x-forwarded-for") ?? "unknown"}`;
      rateLimit = ANON_IP_DAILY_LIMIT;
    }
  } else {
    bucketKey = `ip:${req.headers.get("x-forwarded-for") ?? "unknown"}`;
    rateLimit = ANON_IP_DAILY_LIMIT;
  }

  const { allowed } = await checkRateLimit(supabase, bucketKey, rateLimit);
  if (!allowed) {
    return new Response(
      JSON.stringify({ error: "Daily voice limit reached. Please try again tomorrow." }),
      { status: 429, headers: { ...cors, "Content-Type": "application/json", "Retry-After": "86400" } },
    );
  }

  let body: { text?: string; voice?: string };
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const { text, voice = "male" } = body;
  if (!text || text.length === 0) {
    return new Response(JSON.stringify({ error: "text is required" }), {
      status: 400, headers: { ...cors, "Content-Type": "application/json" },
    });
  }
  if (text.length > 5000) {
    return new Response(JSON.stringify({ error: "Text too long (max 5000 chars)" }), {
      status: 400, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  // Provider 1 — Groq Orpheus
  if (GROQ_API_KEY) {
    const audio = await groqTTS(text, voice, GROQ_API_KEY);
    if (audio) {
      return new Response(audio, {
        headers: { ...cors, "Content-Type": "audio/wav", "Cache-Control": "public, max-age=3600", "X-TTS-Provider": "groq-orpheus" },
      });
    }
    console.warn("[tts] Groq Orpheus unavailable, trying Workers AI");
  }

  // Provider 2 — Cloudflare Workers AI Aura-1
  if (CF_ACCOUNT_ID && CF_API_TOKEN) {
    const audio = await workersAiTTS(text, voice, CF_ACCOUNT_ID, CF_API_TOKEN);
    if (audio) {
      return new Response(audio, {
        headers: { ...cors, "Content-Type": "audio/mpeg", "Cache-Control": "public, max-age=3600", "X-TTS-Provider": "cf-workers-ai-aura" },
      });
    }
    console.warn("[tts] Workers AI Aura-1 unavailable");
  }

  // All providers exhausted — signal client to use browser speechSynthesis
  return new Response(
    JSON.stringify({ error: "TTS unavailable", fallback: "browser" }),
    { status: 503, headers: { ...cors, "Content-Type": "application/json" } },
  );
});
