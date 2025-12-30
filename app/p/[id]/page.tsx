import kv from "../../lib/kv";
import { notFound } from "next/navigation";

export default async function PastePage({ params }: any) {
  const paste = await kv.get<any>(`paste:${params.id}`);
  if (!paste) notFound();

  const now = Date.now();

  if (paste.expires_at && now >= paste.expires_at) notFound();
  if (paste.max_views && paste.views >= paste.max_views) notFound();

  // ✅ real-world: HTML view also counts as view
  paste.views += 1;
  await kv.set(`paste:${params.id}`, paste);

  return (
    <div style={{ padding: 24 }}>
      <h2>Shared Paste</h2>

      <pre
        style={{
          whiteSpace: "pre-wrap",
          background: "#f4f4f4",
          padding: 16,
          borderRadius: 6,
        }}
      >
        {paste.content}
      </pre>

      <p>
        Remaining Views:{" "}
        {paste.max_views ? paste.max_views - paste.views : "Unlimited"}
      </p>

      <p>
        Expires At:{" "}
        {paste.expires_at
          ? new Date(paste.expires_at).toLocaleString()
          : "No expiry"}
      </p>
    </div>
  );
}
