"use client";
import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [views, setViews] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError("");
    setUrl("");
    setLoading(true);

    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        ttl_seconds: ttl ? Number(ttl) : undefined,
        max_views: views ? Number(views) : undefined,
      }),
    });

    let data;
    try {
      data = await res.json();
    } catch {
      setError("Server error. Please try again.");
      setLoading(false);
      return;
    }

    if (!res.ok) {
      setError(data?.error || "Something went wrong");
      setLoading(false);
      return;
    }

    setUrl(data.url);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-200 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl p-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Pastebin Lite
          </h1>
          <p className="mt-2 text-zinc-600">
            Create a paste and share it securely with optional expiry.
          </p>
        </div>

        {/* Textarea */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Paste Content
          </label>
          <textarea
            rows={10}
            placeholder="Paste your text here..."
            className="w-full rounded-lg border border-zinc-300 p-3 text-sm focus:border-black focus:outline-none text-black"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* Options */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">
              TTL (seconds)
            </label>
            <input
              type="number"
              placeholder="e.g. 60"
              className="w-full rounded-lg border border-zinc-300 p-2 text-sm focus:border-black focus:outline-none text-black"
              value={ttl}
              onChange={(e) => setTtl(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-black">
              Max Views
            </label>
            <input
              type="number"
              placeholder="e.g. 5"
              className="w-full rounded-lg border border-zinc-300 p-2 text-sm focus:border-black focus:outline-none text-black"
              value={views}
              onChange={(e) => setViews(e.target.value)}
            />
          </div>
        </div>

        {/* Button */}
        <button
          onClick={submit}
          disabled={loading}
          className="w-full rounded-xl bg-black py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Paste"}
        </button>

        {/* Error */}
        {error && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Result */}
        {url && (
          <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="mb-2 text-sm font-medium text-zinc-700">
              Share this link
            </p>
            <input
              value={url}
              readOnly
              className="w-full rounded-lg border border-zinc-300 bg-white p-2 text-sm text-black"
            />
          </div>
        )}
      </div>
    </main>
  );
}
