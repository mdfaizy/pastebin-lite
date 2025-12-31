import { notFound } from "next/navigation";
import { getRedis } from "../../lib/redis";

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const redis = await getRedis();
  const key = `paste:${id}`;

  const raw = await redis.get(key);
  if (!raw) notFound();

  const paste = JSON.parse(raw);
  const now = Date.now();

  if (paste.expires_at && now >= paste.expires_at) {
    notFound();
  }

  if (paste.max_views !== null && paste.views >= paste.max_views) {
    notFound();
  }

  if (paste.expires_at && now >= paste.expires_at) {
    await redis.del(key);
    notFound();
  }

  if (paste.max_views !== null && paste.views >= paste.max_views) {
    await redis.del(key);
    notFound();
  }

  paste.views += 1;
  await redis.set(key, JSON.stringify(paste));

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-200 p-4 flex items-center justify-center">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-xl p-8">
        <h1 className="text-2xl font-bold mb-4">Shared Paste</h1>

        <pre className="whitespace-pre-wrap bg-white p-6 rounded-lg text-black">
          {paste.content}
        </pre>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
          <div className="rounded-lg bg-zinc-50 p-4 border">
            <p className="font-medium text-zinc-700">Remaining Views</p>
            <p className="mt-1 text-zinc-900">
              {paste.max_views === null
                ? "Unlimited"
                : Math.max(0, paste.max_views - paste.views)}
            </p>
          </div>

          <div className="rounded-lg bg-zinc-50 p-4 border">
            <p className="font-medium text-zinc-700">Expires At</p>
            <p className="mt-1 text-zinc-900">
              {paste.expires_at
                ? new Date(paste.expires_at).toLocaleString()
                : "No expiry"}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
