import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  "https://thelampstand.icu",
  "https://www.thelampstand.icu",
];

const ALLOWED_LOCALHOSTS = [
  "http://localhost:8080",
  "http://localhost:5173",
  "http://localhost:3000",
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  const isAllowed = ALLOWED_ORIGINS.includes(origin) ||
    ALLOWED_LOCALHOSTS.includes(origin);
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Vary": "Origin",
  };
}

// Pastoral, warm, friendly voices — not authoritative
const VOICES = {
  male: "JBFqnCBsd6RMkjVDRZzb",   // George — warm, calm British male
  female: "XrExE9yKIg1WjnnlVkGX",  // Matilda — gentle, warm female
} as const;

// TTS is expensive: tighter limits than text AI
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
          endpoint: "elevenlabs-tts",
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
        .eq("endpoint", "elevenlabs-tts")
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

serve(async (req) => {
  const cors = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: cors });
  }

  try {
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");

    if (!ELEVENLABS_API_KEY) {
      return new Response(JSON.stringify({ error: "Service configuration error" }), {
        status: 500,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    // Rate limiting
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get("Authorization");
    let bucketKey: string;
    let rateLimit: number;

    if (authHeader?.startsWith("Bearer ")) {
      try {
        const { data: { user } } = await supabase.auth.getUser(authHeader.slice(7));
        bucketKey = user?.id ? `user:${user.id}` : `ip:${req.headers.get("x-forwarded-for") || "unknown"}`;
        rateLimit = user?.id ? AUTH_USER_DAILY_LIMIT : ANON_IP_DAILY_LIMIT;
      } catch {
        bucketKey = `ip:${req.headers.get("x-forwarded-for") || "unknown"}`;
        rateLimit = ANON_IP_DAILY_LIMIT;
      }
    } else {
      bucketKey = `ip:${req.headers.get("x-forwarded-for") || "unknown"}`;
      rateLimit = ANON_IP_DAILY_LIMIT;
    }

    const { allowed } = await checkRateLimit(supabase, bucketKey, rateLimit);
    if (!allowed) {
      return new Response(JSON.stringify({ error: "Daily voice limit reached. Please try again tomorrow." }), {
        status: 429,
        headers: { ...cors, "Content-Type": "application/json", "Retry-After": "86400" },
      });
    }

    const { text, voice } = await req.json() as { text: string; voice?: "male" | "female" };

    if (!text || text.length > 5000) {
      return new Response(JSON.stringify({ error: "Text required (max 5000 chars)" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const voiceId = VOICES[voice || "male"];

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.55,
            similarity_boost: 0.7,
            style: 0.35,
            use_speaker_boost: true,
            speed: 0.92,
          },
        }),
      }
    );

    if (!response.ok) {
      console.error("ElevenLabs error:", await response.text());
      return new Response(JSON.stringify({ error: "Voice generation temporarily unavailable" }), {
        status: 502,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
      headers: {
        ...cors,
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("TTS edge function error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
