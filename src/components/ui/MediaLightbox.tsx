"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { useModalBehavior } from "./useModalBehavior";
import { isValidYouTubeId } from "@/lib/upload";

/**
 * 相簿裡的一則媒體。imageUrl 對兩種型別的語意都是「顯示用的那張圖」：
 * 照片是照片本身，影片是封面圖。
 */
export interface MediaItem {
  id: string;
  imageUrl: string;
  caption: string | null;
  mediaType: string;
  videoUrl: string | null;
  youtubeId: string | null;
}

interface MediaLightboxProps {
  items: MediaItem[];
  /** null 表示關閉 */
  index: number | null;
  onClose: () => void;
  onNavigate: (next: number) => void;
  /** 每則媒體標題列下方的補充說明，例如彙整頁要標示影片來自哪場活動 */
  subtitle?: (item: MediaItem) => string | null;
}

export function MediaLightbox({
  items,
  index,
  onClose,
  onNavigate,
  subtitle,
}: MediaLightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  // 記「哪一則播放失敗」而不是「有沒有失敗」，切換媒體時就自然不成立了，
  // 不需要用 effect 去同步清狀態（那會違反 react-hooks/set-state-in-effect，
  // 而且多一次 render）
  const [failedId, setFailedId] = useState<string | null>(null);

  const open = index !== null;
  const item = open ? items[index] : null;
  const playbackFailed = item !== null && failedId === item.id;

  // Esc 關閉 + 背景捲動鎖（含 iOS Safari 的 position:fixed workaround）
  useModalBehavior(open, onClose);

  useEffect(() => {
    if (open) closeButtonRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open || index === null || items.length < 2) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        onNavigate((index - 1 + items.length) % items.length);
      } else if (e.key === "ArrowRight") {
        onNavigate((index + 1) % items.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, items.length, onNavigate]);

  // 早退必須在所有 hook 之後
  if (!item || index === null) return null;

  const isVideo = item.mediaType === "video";
  const ytId = isValidYouTubeId(item.youtubeId) ? item.youtubeId : null;
  const extra = subtitle?.(item);

  return createPortal(
    <div
      // z-index 要高於 Header 的 z-50
      className="fixed inset-0 z-[100] flex items-center justify-center overscroll-contain bg-black/85 p-4 backdrop-blur-sm"
      // 只有點在遮罩本身才關閉；避免拖曳影片進度條或選字放開時誤觸
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="flex w-full max-w-5xl flex-col">
        <div className="mb-2 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p id={titleId} className="truncate text-sm font-medium text-white">
              {item.caption || (isVideo ? "影片" : "照片")}
            </p>
            {extra && <p className="truncate text-xs text-white/60">{extra}</p>}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {items.length > 1 && (
              <span className="text-xs text-white/60">
                {index + 1} / {items.length}
              </span>
            )}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="關閉"
              className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="relative">
          {isVideo && ytId ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1`}
                title={item.caption || "影片"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="absolute inset-0 h-full w-full"
              />
            </div>
          ) : isVideo && item.videoUrl ? (
            <video
              key={item.id}
              src={item.videoUrl}
              poster={item.imageUrl}
              controls
              autoPlay
              // 少了 playsInline，iPhone 會強制跳出原生全螢幕播放器，
              // 整個 lightbox 設計就失效了
              playsInline
              preload="metadata"
              onError={() => setFailedId(item.id)}
              className="max-h-[78dvh] w-full rounded-lg bg-black"
            />
          ) : (
            <div className="relative h-[78dvh] w-full">
              <Image
                src={item.imageUrl}
                alt={item.caption || "照片"}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          )}

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  onNavigate((index - 1 + items.length) % items.length)
                }
                aria-label="上一則"
                className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-xl text-white backdrop-blur-sm transition-colors hover:bg-black/70"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => onNavigate((index + 1) % items.length)}
                aria-label="下一則"
                className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-xl text-white backdrop-blur-sm transition-colors hover:bg-black/70"
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* 編碼問題只會在訪客的瀏覽器爆，不會在管理員那台，所以一定要有出口 */}
        {playbackFailed && item.videoUrl && (
          <p className="mt-2 text-sm text-white">
            這支影片在你的瀏覽器播不出來（可能是編碼不相容）。
            <a href={item.videoUrl} download className="ml-1 underline">
              改為下載影片
            </a>
          </p>
        )}
      </div>
    </div>,
    document.body
  );
}
