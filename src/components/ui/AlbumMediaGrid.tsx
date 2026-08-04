"use client";

import { useState } from "react";
import Image from "next/image";
import { MediaLightbox, type MediaItem } from "./MediaLightbox";

/** 影片封面上的播放圖示。沒有它，影片跟照片在牆上長得一模一樣。 */
export function PlayBadge({ size = "md" }: { size?: "sm" | "md" }) {
  const box = size === "sm" ? "h-11 w-11" : "h-14 w-14";
  const icon = size === "sm" ? "h-5 w-5" : "h-6 w-6";

  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <span
        className={`${box} flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110`}
      >
        <svg
          className={`${icon} ml-0.5 text-white`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </span>
  );
}

export function AlbumMediaGrid({
  items,
  albumTitle,
}: {
  items: MediaItem[];
  albumTitle: string;
}) {
  const [index, setIndex] = useState<number | null>(null);

  return (
    <>
      {/* CSS columns 瀑布流，與改動前相同；差別是每一則現在都可以點開 */}
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={
              item.caption ||
              (item.mediaType === "video" ? "播放影片" : "查看大圖")
            }
            className="group mb-4 block w-full break-inside-avoid text-left"
          >
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src={item.imageUrl}
                alt={item.caption || albumTitle}
                width={800}
                height={600}
                className="w-full transition-transform duration-300 group-hover:scale-[1.02]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {item.mediaType === "video" && <PlayBadge />}
            </div>
            {item.caption && (
              <p className="mt-2 text-center text-sm text-gray-600">
                {item.caption}
              </p>
            )}
          </button>
        ))}
      </div>

      <MediaLightbox
        items={items}
        index={index}
        onClose={() => setIndex(null)}
        onNavigate={setIndex}
      />
    </>
  );
}
