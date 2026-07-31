"use client";

import Link from "next/link";
import { useState } from "react";
import { DeleteButton } from "@/components/admin/DeleteButton";

interface VideoRow {
  id: string;
  title: string;
  source: string;
  eventDate: string | null;
  published: boolean;
}

export function VideoListClient({
  videos,
  deleteVideo,
}: {
  videos: VideoRow[];
  deleteVideo: (id: string) => Promise<{ error?: string; warning?: string }>;
}) {
  // Blob 檔案沒刪掉時的警告要放在列表層——刪除成功後那一列就消失了，
  // 訊息若掛在列裡面會跟著不見，管理員永遠不會知道有孤兒檔案。
  const [warning, setWarning] = useState("");

  async function handleDelete(id: string) {
    const result = await deleteVideo(id);
    if (result.warning) setWarning(result.warning);
    return result;
  }

  return (
    <div className="space-y-3">
      {warning && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded text-sm whitespace-pre-wrap break-all">
          {warning}
        </div>
      )}

      {videos.map((video) => (
        <div
          key={video.id}
          className="bg-white p-4 rounded-lg border flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{video.title}</span>
              <span
                className={`px-2 py-0.5 text-xs rounded ${
                  video.source === "youtube"
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {video.source === "youtube" ? "YouTube" : "自架"}
              </span>
              <span
                className={`px-2 py-0.5 text-xs rounded ${
                  video.published
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {video.published ? "已發布" : "草稿"}
              </span>
            </div>
            {video.eventDate && (
              <p className="text-sm text-gray-500">{video.eventDate}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/videos/${video.id}`}
              className="px-3 py-1 text-xs text-blue-600 border border-blue-300 rounded hover:bg-blue-50"
            >
              編輯
            </Link>
            <DeleteButton
              onDelete={() => handleDelete(video.id)}
              itemName="此影片"
            />
          </div>
        </div>
      ))}

      {videos.length === 0 && (
        <p className="text-gray-500 text-sm">尚無影片</p>
      )}
    </div>
  );
}
