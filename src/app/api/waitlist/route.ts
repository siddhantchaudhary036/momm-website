import { NextResponse } from "next/server";

/**
 * Waitlist signup — a server-side proxy to Convex.
 *
 * All of Momm's backend code lives in the app repo's `convex/` folder (one
 * deployment, one schema), so this site has no Convex client and no generated
 * API. It knows the backend only as a URL in an environment variable and posts
 * to its `POST /waitlist` HTTP action from the server, which keeps the
 * deployment URL and the shared secret out of the browser bundle — and keeps the
 * publicly reachable write path on our own domain, where it can be rate-limited.
 *
 * Validation and normalization are Convex's job, not ours; we forward the
 * address and pass its verdict back.
 */
export async function POST(request: Request) {
  const convexSiteUrl = process.env.CONVEX_SITE_URL;
  const secret = process.env.WAITLIST_INGEST_SECRET;
  if (!convexSiteUrl || !secret) {
    console.error(
      "waitlist: CONVEX_SITE_URL and/or WAITLIST_INGEST_SECRET is not set",
    );
    return NextResponse.json({ error: "not_configured" }, { status: 500 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "malformed_body" }, { status: 400 });
  }
  const { email } = (payload as { email?: unknown }) ?? {};
  if (typeof email !== "string") {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${convexSiteUrl}/waitlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({ email }),
    });
  } catch (cause) {
    console.error("waitlist: Convex unreachable", cause);
    return NextResponse.json({ error: "upstream_unreachable" }, { status: 502 });
  }

  if (!upstream.ok) {
    // 400 is Convex refusing the address; anything else is our problem, not the
    // visitor's, and its details stay in the logs.
    if (upstream.status === 400) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }
    console.error(
      `waitlist: Convex returned ${upstream.status} ${await upstream.text()}`,
    );
    return NextResponse.json({ error: "upstream_error" }, { status: 502 });
  }

  // `{ status: "joined" | "already" }` — a repeat signup is a success, not an
  // error, so the visitor gets the same warm confirmation either way.
  return NextResponse.json(await upstream.json(), { status: 200 });
}
