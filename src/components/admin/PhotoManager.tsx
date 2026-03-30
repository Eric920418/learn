"use client";

import { useState, useTransition } from "react";
import { MultiImageUpload } from "./MultiImageUpload";
import { DeleteButton } from "./DeleteButton";

interface Photo {
  id: string;
  imageUrl: string;
  caption: string | null;
  sortOrder: number;
}

interface PhotoManagerProps {
  albumId: string;
  photos: Photo[];
  addPhotos: (albumId: string, urls: string[]) => Promise<{ error?: string }>;
  updatePhoto: (formData: FormData) => Promise<{ error?: string }>;
  deletePhoto: (id: string, albumId: string) => Promise<{ error?: string }>;
}

export function PhotoManager({
  albumId,
  photos,
  addPhotos,
  updatePhoto,
  deletePhoto,
}: PhotoManagerProps) {
  return (
    <div className="space-y-6">
      <MultiImageUpload
        onUploaded={(urls) => addPhotos(albumId, urls)}
      />

      {photos.length === 0 && (
        <p className="text-sm text-gray-500">尚無照片，請上傳照片</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            albumId={albumId}
            updatePhoto={updatePhoto}
            deletePhoto={deletePhoto}
          />
        ))}
      </div>
    </div>
  );
}

function PhotoCard({
  photo,
  albumId,
  updatePhoto,
  deletePhoto,
}: {
  photo: Photo;
  albumId: string;
  updatePhoto: (formData: FormData) => Promise<{ error?: string }>;
  deletePhoto: (id: string, albumId: string) => Promise<{ error?: string }>;
}) {
  const [caption, setCaption] = useState(photo.caption || "");
  const [sortOrder, setSortOrder] = useState(photo.sortOrder);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSave() {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("id", photo.id);
      formData.set("albumId", albumId);
      formData.set("caption", caption);
      formData.set("sortOrder", String(sortOrder));
      const result = await updatePhoto(formData);
      if (result?.error) setError(result.error);
      else setError("");
    });
  }

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.imageUrl}
        alt={photo.caption || "照片"}
        className="w-full aspect-square object-cover"
      />
      <div className="p-2 space-y-2">
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="圖片說明"
          className="w-full text-xs border rounded px-2 py-1"
        />
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500">排序</label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="w-16 text-xs border rounded px-2 py-1"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={isPending}
            className="px-2 py-1 text-xs text-blue-600 border border-blue-300 rounded hover:bg-blue-50 disabled:opacity-50"
          >
            {isPending ? "儲存中..." : "儲存"}
          </button>
          <DeleteButton
            onDelete={() => deletePhoto(photo.id, albumId)}
            itemName="此照片"
          />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
}
