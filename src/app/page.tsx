"use client";

import { useState } from "react";

export default function HomePage() {
  const [uid, setUid] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTopUp = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid }),
      });

      const data = await res.json();
      if (!data.token) throw new Error("No token returned");

      const platformUrl = process.env.NEXT_PUBLIC_PLATFORM_URL;

      // Open new window with iframe that simulates Bybit WebView
      const newWindow = window.open("", "_blank", "width=480,height=800");
      if (!newWindow) throw new Error("Failed to open window");

      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Bybit Cash Top Up</title>
            <style>
              body { margin: 0; padding: 0; overflow: hidden; }
              iframe { width: 100vw; height: 100vh; border: none; }
            </style>
          </head>
          <body>
            <iframe id="platform-frame" src="${platformUrl}"></iframe>
            <script>
              const iframe = document.getElementById("platform-frame");
              iframe.onload = () => {
                const originalFetch = iframe.contentWindow.fetch;
                iframe.contentWindow.fetch = (url, options = {}) => {
                  options.headers = Object.assign({}, options.headers, {
                    Authorization: "Bearer ${data.token}"
                  });
                  return originalFetch(url, options);
                };
              };
            </script>
          </body>
        </html>
      `);
    } catch (err) {
      console.error(err);
      alert("Failed to start top up flow");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="items-center justify-center gap-4 min-h-screen bg-[#16171c] flex flex-col w-full max-w-[589px] mx-auto">
      <h1 className="text-2xl text-white font-bold">Bybit App</h1>
      <input
        type="text"
        value={uid}
        onChange={(e) => setUid(e.target.value)}
        placeholder="Enter Bybit UID"
        className="border rounded p-2 text-black bg-white"
      />
      <button
        onClick={handleTopUp}
        disabled={!uid || loading}
        className="bg-[#f7a600] hover:bg-[#ffc35c] active:bg-[#f0960e] text-black px-4 py-2 rounded disabled:opacity-50 font-bold"
      >
        {loading ? "Loading..." : "Cash Top Up"}
      </button>
    </main>
  );
}
