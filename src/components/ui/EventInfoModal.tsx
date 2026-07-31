"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useModalBehavior } from "./useModalBehavior";

export default function EventInfoModal({ info, titleCn }: { info: string; titleCn: string }) {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  // Esc 關閉 + 鎖住背景滾動（含 iOS Safari 的 position:fixed workaround）
  useModalBehavior(open, () => setOpen(false));

  // 開啟時把焦點移進 dialog，鍵盤與螢幕閱讀器才不會留在背景
  useEffect(() => {
    if (open) closeButtonRef.current?.focus();
  }, [open]);

  // 早退必須留在所有 hook 之後——移到上面會讓 info 為空字串時 hook 數量不一致
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

      {open &&
        createPortal(
          <div
            // z-index 要高於 Header 的 z-50
            className="fixed inset-0 z-[100] flex items-end justify-center overscroll-contain bg-black/60 backdrop-blur-sm sm:items-center sm:p-4"
            // 只有點在遮罩本身才關閉；避免在內容區選字後放開滑鼠誤觸關閉
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <div className="flex max-h-[88dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[85dvh] sm:max-w-2xl sm:rounded-2xl">
              <div className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-100 px-6 py-4">
                <h3 id={titleId} className="text-lg font-bold text-[#1d2087]">
                  {titleCn}
                </h3>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="關閉"
                  className="-mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              {/* 只有這一塊滾動，overscroll-contain 防止滾到底時把滾動鏈傳給背景 */}
              <div className="overflow-y-auto overscroll-contain px-6 py-5 whitespace-pre-line text-sm leading-relaxed text-gray-700">
                {info}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
