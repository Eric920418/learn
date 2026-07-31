"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { useModalBehavior } from "./useModalBehavior";
import { isValidYouTubeId } from "@/lib/upload";

interface VideoItem {
  id: string;
  title: string;
  description: string | null;
  source: string;
  videoUrl: string | null;
  youtubeId: string | null;
  posterImage: string | null;
  eventDate: string | null;
}

/**
 * YouTube 官方縮圖。用 hqdefault 而非 maxresdefault——後者只有以 HD 上傳的
 * 影片才存在，其餘會回 404 變成破圖。
 */
function youtubeThumbnail(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function VideoGallery({ videos }: { videos: VideoItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [playbackFailed, setPlaybackFailed] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const active = videos.find((v) => v.id === activeId) ?? null;

  function close() {
    setActiveId(null);
    setPlaybackFailed(false);
  }

  useModalBehavior(active !== null, close);

  // 開啟時把焦點移進 dialog，鍵盤與螢幕閱讀器才不會留在背景的卡片上
  useEffect(() => {
    if (activeId) closeButtonRef.current?.focus();
  }, [activeId]);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {videos.map((video) => {
          const ytId = isValidYouTubeId(video.youtubeId)
            ? video.youtubeId
            : null;

          return (
            <button
              key={video.id}
              type="button"
              onClick={() => {
                setPlaybackFailed(false);
                setActiveId(video.id);
              }}
              className="group block w-full overflow-hidden rounded-lg bg-white text-left shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] bg-gradient-to-br from-[#1d2087] to-[#256f91]">
                {video.posterImage ? (
                  <Image
                    src={video.posterImage}
                    alt={video.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  ytId && (
                    /*
                      YouTube 縮圖用原生 img：這樣就不必把 i.ytimg.com 加進
                      next.config 的 remotePatterns，也不會把外部圖片送進
                      Vercel Image Optimization（那是按次計費的）。
                    */
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={youtubeThumbnail(ytId)}
                      alt={video.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )
                )}

                {/* 播放圖示：沒有它，封面圖看起來就只是一張照片 */}
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    <svg
                      className="ml-1 h-6 w-6 text-white"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold text-[#1d2087]">
                  {video.title}
                </h3>
                {video.eventDate && (
                  <p className="mt-1 text-sm text-gray-500">
                    {video.eventDate}
                  </p>
                )}
                {video.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                    {video.description}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {active &&
        createPortal(
          <div
            // z-index 要高於 Header 的 z-50
            className="fixed inset-0 z-[100] flex items-center justify-center overscroll-contain bg-black/80 p-4 backdrop-blur-sm"
            // 只有點在遮罩本身才關閉；避免拖曳影片進度條放開時誤觸關閉
            onClick={(e) => {
              if (e.target === e.currentTarget) close();
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <div className="w-full max-w-4xl">
              <div className="mb-2 flex items-start justify-between gap-4">
                <h3 id={titleId} className="font-bold text-white">
                  {active.title}
                </h3>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={close}
                  aria-label="關閉"
                  className="-mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {active.source === "youtube" &&
              isValidYouTubeId(active.youtubeId) ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${active.youtubeId}?autoplay=1`}
                    title={active.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              ) : active.videoUrl ? (
                <>
                  <video
                    src={active.videoUrl}
                    poster={active.posterImage ?? undefined}
                    controls
                    autoPlay
                    // 少了 playsInline，iPhone 會強制跳出原生全螢幕播放器，
                    // 整個 lightbox 設計就失效了
                    playsInline
                    preload="metadata"
                    onError={() => setPlaybackFailed(true)}
                    className="max-h-[80dvh] w-full rounded-lg bg-black"
                  />
                  {/* 編碼問題只會在訪客的瀏覽器爆，不會在管理員那台，所以一定要有出口 */}
                  {playbackFailed && (
                    <p className="mt-2 text-sm text-white">
                      這支影片在你的瀏覽器播不出來（可能是編碼不相容）。
                      <a
                        href={active.videoUrl}
                        download
                        className="ml-1 underline"
                      >
                        改為下載影片
                      </a>
                    </p>
                  )}
                </>
              ) : (
                <p className="rounded-lg bg-black/50 p-6 text-sm text-white">
                  這支影片的來源設定不完整，請聯絡管理員。
                </p>
              )}

              {active.description && (
                <p className="mt-3 text-sm whitespace-pre-line text-white/80">
                  {active.description}
                </p>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
