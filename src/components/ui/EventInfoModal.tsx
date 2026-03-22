"use client";

import { useState } from "react";

export default function EventInfoModal({ info, titleCn }: { info: string; titleCn: string }) {
  const [open, setOpen] = useState(false);

  if (!info) return null;

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        className="mt-4 inline-flex items-center gap-1 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
      >
        查看詳情
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <h3 className="text-lg font-bold text-[#1d2087]">{titleCn}</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
              {info}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
