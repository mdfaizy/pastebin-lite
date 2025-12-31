// import { notFound } from "next/navigation";
// import redis from "../../lib/redis";

// export default async function PastePage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   // ✅ Next.js 15 fix
//   const { id } = await params;
//   const key = `paste:${id}`;

//   const raw = await redis.get(key);
//   if (!raw) notFound();

//   const paste = JSON.parse(raw as string);
//   const now = Date.now();

//   // ⏱ TTL check
//   if (paste.expires_at && now >= paste.expires_at) {
//     await redis.del(key);
//     notFound();
//   }

//   // 👀 View limit check
//   if (paste.max_views !== null && paste.views >= paste.max_views) {
//     await redis.del(key);
//     notFound();
//   }

//   // ✅ HTML view also counts as a view
//   paste.views += 1;
//   await redis.set(key, JSON.stringify(paste));

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-200 p-4 flex items-center justify-center">
//       <div className="w-full max-w-4xl rounded-2xl bg-white shadow-xl p-8">
//         {/* Header */}
//         <div className="mb-6 border-b border-zinc-200 pb-4">
//           <h1 className="text-2xl font-bold text-zinc-900">
//             Shared Paste
//           </h1>
//           <p className="mt-1 text-sm text-zinc-600">
//             Securely shared text snippet
//           </p>
//         </div>

//         {/* Paste Content */}
//         <pre className="mb-6 max-h-[500px] overflow-auto rounded-xl bg-white p-6 text-sm text-black whitespace-pre-wrap">
//           {paste.content}
//         </pre>

//         {/* Metadata */}
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
//           <div className="rounded-lg bg-zinc-50 p-4 border">
//             <p className="font-medium text-zinc-700">Remaining Views</p>
//             <p className="mt-1 text-zinc-900">
//               {paste.max_views === null
//                 ? "Unlimited"
//                 : Math.max(0, paste.max_views - paste.views)}
//             </p>
//           </div>

//           <div className="rounded-lg bg-zinc-50 p-4 border">
//             <p className="font-medium text-zinc-700">Expires At</p>
//             <p className="mt-1 text-zinc-900">
//               {paste.expires_at
//                 ? new Date(paste.expires_at).toLocaleString()
//                 : "No expiry"}
//             </p>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

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

  

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-200 p-4 flex items-center justify-center">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-xl p-8">
        <h1 className="text-2xl font-bold mb-4">Shared Paste</h1>

        <pre className="whitespace-pre-wrap bg-zinc-100 p-6 rounded-lg">
          {paste.content}
        </pre>
      </div>
    </main>
  );
}
