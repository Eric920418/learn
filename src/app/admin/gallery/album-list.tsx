"use client";

import Link from "next/link";
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
  deleteAlbum: (id: string) => Promise<{ error?: string }>;
}) {
  return (
    <div className="space-y-3">
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
              onDelete={() => deleteAlbum(album.id)}
              itemName="此相簿"
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
