import { NextRequest, NextResponse } from "next/server";
import kv from "../../lib/kv";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.content || typeof body.content !== "string") {
    return NextResponse.json(
      { error: "content is required" },
      { status: 400 }
    );
  }

  const ttl = body.ttl_seconds ?? null;
  const maxViews = body.max_views ?? null;

  if (ttl !== null && (!Number.isInteger(ttl) || ttl < 1)) {
    return NextResponse.json({ error: "invalid ttl" }, { status: 400 });
  }

  if (maxViews !== null && (!Number.isInteger(maxViews) || maxViews < 1)) {
    return NextResponse.json({ error: "invalid max_views" }, { status: 400 });
  }

  const id = nanoid(8);
  const now = Date.now();

  const paste = {
    id,
    content: body.content,
    created_at: now,
    expires_at: ttl ? now + ttl * 1000 : null,
    max_views: maxViews,
    views: 0,
  };

  await kv.set(`paste:${id}`, paste);

  return NextResponse.json({
    id,
    url: `${req.nextUrl.origin}/p/${id}`,
  });
}
