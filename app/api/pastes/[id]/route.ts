// import { NextRequest, NextResponse } from "next/server";
// import redis from "../../../lib/redis";
// import { getNow } from "../../../lib/time";

// export async function GET(
//   req: NextRequest,
//   context: { params: Promise<{ id: string }> } // ✅ Promise REQUIRED
// ) {
//   const { id } = await context.params;
//   const key = `paste:${id}`;

//   const raw = await redis.get(key);
//   if (!raw) {
//     return NextResponse.json({ error: "not found" }, { status: 404 });
//   }

//   const paste = JSON.parse(raw as string);
//   const now = getNow(req);

//   // ⏱ TTL
//   if (paste.expires_at && now >= paste.expires_at) {
//     await redis.del(key);
//     return NextResponse.json({ error: "expired" }, { status: 404 });
//   }

//   // 👀 View limit
//   if (paste.max_views !== null && paste.views >= paste.max_views) {
//     await redis.del(key);
//     return NextResponse.json({ error: "view limit" }, { status: 404 });
//   }

//   // ✅ Increment views
//   paste.views += 1;
//   await redis.set(key, JSON.stringify(paste));

//   return NextResponse.json({
//     content: paste.content,
//     remaining_views:
//       paste.max_views === null
//         ? null
//         : Math.max(0, paste.max_views - paste.views),
//     expires_at: paste.expires_at
//       ? new Date(paste.expires_at).toISOString()
//       : null,
//   });
// }

import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "../../../lib/redis";
import { getNow } from "../../../lib/time";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const redis = await getRedis();
  const key = `paste:${id}`;

  const raw = await redis.get(key);
  if (!raw) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const paste = JSON.parse(raw);
  const now = getNow(req);

  if (paste.expires_at && now >= paste.expires_at) {
    await redis.del(key);
    return NextResponse.json({ error: "expired" }, { status: 404 });
  }

  if (paste.max_views !== null && paste.views >= paste.max_views) {
    await redis.del(key);
    return NextResponse.json({ error: "view limit" }, { status: 404 });
  }

  // ✅ ONLY PLACE where views increment
  paste.views += 1;
  await redis.set(key, JSON.stringify(paste));

  return NextResponse.json({
    content: paste.content,
    remaining_views:
      paste.max_views === null
        ? null
        : Math.max(0, paste.max_views - paste.views),
    expires_at: paste.expires_at
      ? new Date(paste.expires_at).toISOString()
      : null,
  });
}
