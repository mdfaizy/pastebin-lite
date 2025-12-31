import { NextResponse } from "next/server";
import { getRedis } from "../../lib/redis";

export async function GET() {
  try {
    const redis = await getRedis();
    await redis.ping();

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
