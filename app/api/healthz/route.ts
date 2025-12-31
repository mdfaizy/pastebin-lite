import { NextResponse } from "next/server";
import redis from "../../lib/redis";

export async function GET() {
  try {
    // ✅ Redis connectivity check
    await redis.ping();

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Health check failed:", error);

    return NextResponse.json(
      { ok: false },
      { status: 500 }
    );
  }
}
