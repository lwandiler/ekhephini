import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, range",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Expose-Headers": "Content-Type, Content-Length, Accept-Ranges, Content-Range, ETag, Cache-Control",
};

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { searchParams } = new URL(req.url);
    const target = searchParams.get("url");

    if (!target) {
      return new Response(JSON.stringify({ error: "Missing 'url' query parameter" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let upstream: URL;
    try {
      upstream = new URL(target);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid URL" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Security: allow only http/https
    if (upstream.protocol !== "https:" && upstream.protocol !== "http:") {
      return new Response(JSON.stringify({ error: "Protocol not allowed" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Optional allowlist: uncomment to restrict
    // const allowedHosts = new Set(["delivery.broadsmart-streaming.co.za"]);
    // if (!allowedHosts.has(upstream.hostname)) {
    //   return new Response(JSON.stringify({ error: "Host not allowed" }), {
    //     status: 403,
    //     headers: { ...corsHeaders, "Content-Type": "application/json" },
    //   });
    // }

    const forwardHeaders: HeadersInit = {};
    const range = req.headers.get("range");
    if (range) forwardHeaders["Range"] = range;
    // Forward reasonable cache header hints from client
    const ifNoneMatch = req.headers.get("if-none-match");
    if (ifNoneMatch) forwardHeaders["If-None-Match"] = ifNoneMatch;

    const resp = await fetch(upstream.toString(), {
      method: "GET",
      headers: forwardHeaders,
      redirect: "follow",
    });

    // Prepare headers to return, preserving useful upstream headers
    const outHeaders = new Headers(corsHeaders);
    const passThrough = [
      "content-type",
      "content-length",
      "accept-ranges",
      "content-range",
      "etag",
      "cache-control",
      "last-modified",
      "expires",
    ];
    for (const key of passThrough) {
      const v = resp.headers.get(key);
      if (v) outHeaders.set(key, v);
    }

    return new Response(resp.body, {
      status: resp.status,
      headers: outHeaders,
    });
  } catch (err) {
    console.error("stream-proxy error:", err);
    return new Response(JSON.stringify({ error: "Proxy error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
