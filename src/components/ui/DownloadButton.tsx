"use client";

import { useCallback } from "react";

interface DownloadButtonProps {
  url: string;
  filename?: string;
}

export default function DownloadButton({ url, filename }: DownloadButtonProps) {
  const handleDownload = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const params = new URLSearchParams({ url });
      if (filename) params.set("filename", filename);

      window.open(`/api/download?${params.toString()}`, "_self");
    },
    [url, filename]
  );

  return (
    <button
      type="button"
      onClick={handleDownload}
      aria-label="下載海報"
      className="absolute bottom-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    </button>
  );
}
