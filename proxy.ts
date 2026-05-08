import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const allowedOrigins = [
  "https://oryon-web.vercel.app",
  "http://localhost:3000",
];

const corsHeaders = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function proxy(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "";
  const isAllowed = allowedOrigins.includes(origin);

  // Preflight (OPTIONS) — browser sends this before the real request
  if (request.method === "OPTIONS") {
    return NextResponse.json(
      {},
      {
        headers: {
          ...(isAllowed && { "Access-Control-Allow-Origin": origin }),
          ...corsHeaders,
        },
      },
    );
  }

  // Actual request — attach CORS headers to the response
  const response = NextResponse.next();
  if (isAllowed) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }
  Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
