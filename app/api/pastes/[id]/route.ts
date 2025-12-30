import { NextRequest, NextResponse } from "next/server";
import kv from "../../../lib/kv";
import { getNow } from "../../../lib/time";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const paste = await kv.get<any>(`paste:${params.id}`);
  if (!paste) return NextResponse.json({ error: "not found" }, { status: 404 });

  const now = getNow(req);

  if (paste.expires_at && now >= paste.expires_at) {
    return NextResponse.json({ error: "expired" }, { status: 404 });
  }

  if (paste.max_views && paste.views >= paste.max_views) {
    return NextResponse.json({ error: "view limit" }, { status: 404 });
  }

  paste.views += 1;
  await kv.set(`paste:${params.id}`, paste);

  return NextResponse.json({
    content: paste.content,
    remaining_views: paste.max_views
      ? paste.max_views - paste.views
      : null,
    expires_at: paste.expires_at
      ? new Date(paste.expires_at).toISOString()
      : null,
  });
}
