"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function EventInfoModal({ info, titleCn }: { info: string; titleCn: string }) {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  // Esc 關閉
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // 鎖住背景滾動：用 body position: fixed 而非 overflow: hidden，
  // 因為 iOS Safari 會忽略 body 的 overflow: hidden，背景照樣能滑。
  // 代價是必須自己記住並還原 scrollY。
  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    const { style } = document.body;
    const prev = {
      position: style.position,
      top: style.top,
      left: style.left,
      right: style.right,
      overflowY: style.overflowY,
    };

    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.left = "0";
    style.right = "0";
    // body 變 fixed 後文件高度歸零、捲軸消失會造成版面橫向跳動，強制保留捲軸槽
    style.overflowY = "scroll";

    return () => {
      Object.assign(style, prev);
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  // 開啟時把焦點移進 dialog，鍵盤與螢幕閱讀器才不會留在背景
  useEffect(() => {
    if (open) closeButtonRef.current?.focus();
  }, [open]);

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
