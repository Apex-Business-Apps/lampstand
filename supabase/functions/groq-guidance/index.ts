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
  const isAllowed = ALLOWED_ORIGINS.includes(origin) || ALLOWED_LOCALHOSTS.includes(origin);
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Vary": "Origin",
  };
}

// Rate limit constants
const AUTH_USER_DAILY_LIMIT = 100;
const ANON_IP_DAILY_LIMIT = 20;

async function checkRateLimit(
  supabase: ReturnType<typeof createClient>,
  bucketKey: string,
  limit: number,
  endpoint: string,
): Promise<{ allowed: boolean; remaining: number }> {
  const windowStart = new Date();
  windowStart.setHours(0, 0, 0, 0);

  try {
    const { data, error } = await supabase.rpc('increment_api_rate_limit', {
      p_bucket_key: bucketKey,
      p_endpoint: endpoint,
      p_window_start: windowStart.toISOString(),
    });

    if (error) {
      // Rate limit bookkeeping failed — DENY to protect costs (fail-safe)
      console.warn(`[${endpoint}] rate limit RPC failed:`, error.message);
      return { allowed: false, remaining: 0 };
    }

    const count = data as number;
    return { allowed: count <= limit, remaining: Math.max(0, limit - count) };
  } catch (e) {
    console.warn(`[${endpoint}] rate limit check threw:`, e);
    return { allowed: false, remaining: 0 };
  }
}

serve(async (req) => {
  const cors = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: cors });
  }

  const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
  if (!GROQ_API_KEY) {
    return new Response(JSON.stringify({ error: "Service configuration error" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  // F-014 FIX: guard Supabase env vars before use — non-null assertions
  // would throw a runtime TypeError if misconfigured, swallowed by the catch block.
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !supabaseServiceKey) {
    return new Response(JSON.stringify({ error: "Server configuration error" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  try {
    // Rate limiting: prefer authenticated user, fall back to IP
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get("Authorization");
    let bucketKey: string;
    let rateLimit: number;

    if (authHeader?.startsWith("Bearer ")) {
      // Try to extract user_id from JWT for per-user limiting
      const token = authHeader.slice(7);
      try {
        const { data: { user } } = await supabase.auth.getUser(token);
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

    const { allowed, remaining } = await checkRateLimit(supabase, bucketKey, rateLimit, 'groq-guidance');
    if (!allowed) {
      return new Response(JSON.stringify({ error: "Daily request limit reached. Please try again tomorrow." }), {
        status: 429,
        headers: {
          ...cors,
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": "0",
          "Retry-After": "86400",
        },
      });
    }

    // Parse and validate request
    const body = await req.json() as {
      messages: Array<{ role: string; content: string }>;
      json?: boolean;
      maxTokens?: number;
    };

    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages array required" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    // Validate message count and total content length to prevent abuse
    if (body.messages.length > 10) {
      return new Response(JSON.stringify({ error: "Too many messages" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const totalLength = body.messages.reduce((sum, m) => sum + (m.content?.length || 0), 0);
    if (totalLength > 8000) {
      return new Response(JSON.stringify({ error: "Request content too long" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const maxTokens = Math.min(body.maxTokens ?? 400, 1500);

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: body.messages,
        response_format: body.json ? { type: "json_object" } : { type: "text" },
        temperature: 0.5,
        max_completion_tokens: maxTokens,
      }),
    });

    if (!groqRes.ok) {
      console.error("[groq-guidance] Groq error:", groqRes.status);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 502,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const data = await groqRes.json();
    const content = data.choices?.[0]?.message?.content ?? "";

    return new Response(JSON.stringify({ content }), {
      headers: {
        ...cors,
        "Content-Type": "application/json",
        "X-RateLimit-Remaining": String(remaining),
      },
    });
  } catch (err) {
    console.error("[groq-guidance] error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
