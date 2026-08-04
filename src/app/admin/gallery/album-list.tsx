"use client";

import Link from "next/link";
import { useState } from "react";
import { DeleteButton } from "@/components/admin/DeleteButton";

interface Album {
  id: string;
  title: string;
  eventDate: string;
  published: boolean;
  sortOrder: number;
}

export function AlbumListClient({
  albums,
  deleteAlbum,
}: {
  albums: Album[];
  deleteAlbum: (id: string) => Promise<{ error?: string; warning?: string }>;
}) {
  // 刪除相簿會連帶刪掉裡面所有照片與影片的 Blob 檔案。一本有幾支影片的相簿
  // 就是幾百 MB，清不掉一定要講出來——而且那一列刪完就消失了，訊息得掛在列表層。
  const [warning, setWarning] = useState("");

  async function handleDelete(id: string) {
    const result = await deleteAlbum(id);
    if (result?.warning) setWarning(result.warning);
    return result;
  }

  return (
    <div className="space-y-3">
      {warning && (
        <div className="rounded border border-amber-200 bg-amber-50 p-3 text-sm whitespace-pre-wrap break-all text-amber-800">
          {warning}
        </div>
      )}
      {albums.map((album) => (
        <div
          key={album.id}
          className="bg-white p-4 rounded-lg border flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{album.title}</span>
              <span
                className={`px-2 py-0.5 text-xs rounded ${
                  album.published
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {album.published ? "已發布" : "草稿"}
              </span>
            </div>
            <p className="text-sm text-gray-500">{album.eventDate}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/gallery/${album.id}`}
              className="px-3 py-1 text-xs text-blue-600 border border-blue-300 rounded hover:bg-blue-50"
            >
              編輯
            </Link>
            <Link
              href={`/admin/gallery/${album.id}/photos`}
              className="px-3 py-1 text-xs text-green-600 border border-green-300 rounded hover:bg-green-50"
            >
              管理照片
            </Link>
            <DeleteButton
              onDelete={() => handleDelete(album.id)}
              itemName="此相簿（含裡面所有照片與影片）"
            />
          </div>
        </div>
      ))}
      {albums.length === 0 && (
        <p className="text-gray-500 text-sm">尚無相簿</p>
      )}
    </div>
  );
}
