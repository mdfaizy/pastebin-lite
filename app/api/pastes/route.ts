import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "../../lib/redis";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  try {
    const redis = await getRedis();
    const { content, ttl_seconds, max_views } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json({ error: "content required" }, { status: 400 });
    }

    const id = nanoid(8);
    const now = Date.now();

    const paste = {
      id,
      content,
      created_at: now,
      expires_at: ttl_seconds ? now + ttl_seconds * 1000 : null,
      max_views: max_views ?? null,
      views: 0,
    };

    await redis.set(`paste:${id}`, JSON.stringify(paste));

    return NextResponse.json({
      id,
      url: `${req.nextUrl.origin}/p/${id}`,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
