import { NextRequest, NextResponse } from "next/server";
import redis from "../../lib/redis";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content, ttl_seconds, max_views } = body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { error: "content is required" },
        { status: 400 }
      );
    }

    if (ttl_seconds && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
      return NextResponse.json(
        { error: "ttl_seconds must be >= 1" },
        { status: 400 }
      );
    }

    if (max_views && (!Number.isInteger(max_views) || max_views < 1)) {
      return NextResponse.json(
        { error: "max_views must be >= 1" },
        { status: 400 }
      );
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
    console.error("POST /api/pastes error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
