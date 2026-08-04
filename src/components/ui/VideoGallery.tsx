"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MediaLightbox, type MediaItem } from "./MediaLightbox";
import { PlayBadge } from "./AlbumMediaGrid";

/** 彙整頁的影片：媒體本身 + 它所屬相簿的資訊。 */
export interface AggregatedVideo extends MediaItem {
  albumId: string;
  albumTitle: string;
  albumEventDate: string;
}

export function VideoGallery({ videos }: { videos: AggregatedVideo[] }) {
  const [index, setIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {videos.map((video, i) => (
          <div
            key={video.id}
            className="overflow-hidden rounded-lg bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            {/*
              卡片主體是按鈕（開 lightbox），下方的「查看相簿」是連結。
              兩者必須分開——button 裡包 a 是無效的 HTML，鍵盤操作也會壞掉。
            */}
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`播放 ${video.caption || video.albumTitle}`}
              className="group relative block w-full"
            >
              <div className="relative aspect-[4/3] bg-gradient-to-br from-[#1d2087] to-[#256f91]">
                <Image
                  src={video.imageUrl}
                  alt={video.caption || video.albumTitle}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <PlayBadge />
              </div>
            </button>

            <div className="p-4">
              <h3 className="text-lg font-bold text-[#1d2087]">
                {video.caption || video.albumTitle}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {video.albumEventDate}
              </p>
              <Link
                href={`/gallery/${video.albumId}`}
                className="mt-2 inline-block text-sm text-[#256f91] hover:underline"
              >
                查看「{video.albumTitle}」相簿 →
              </Link>
            </div>
          </div>
        ))}
      </div>

      <MediaLightbox
        items={videos}
        index={index}
        onClose={() => setIndex(null)}
        onNavigate={setIndex}
        subtitle={(item) => {
          const v = videos.find((x) => x.id === item.id);
          return v ? `${v.albumTitle}・${v.albumEventDate}` : null;
        }}
      />
    </>
  );
}
