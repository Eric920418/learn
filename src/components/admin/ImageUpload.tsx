"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageUploadProps {
  name: string;
  currentImage?: string | null;
  label?: string;
}

export function ImageUpload({ name, currentImage, label = "圖片" }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState(currentImage || "");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("檔案大小不能超過 5MB");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("只支援 JPG、PNG、WebP 格式");
      return;
    }

    setError("");
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "上傳失敗");
      }

      setUploadedUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "上傳失敗");
      setPreview(currentImage || null);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type="hidden" name={name} value={uploadedUrl} />
      <div className="flex items-start gap-4">
        {preview && (
          <div className="relative w-24 h-24 rounded overflow-hidden border">
            <Image src={preview} alt="preview" fill className="object-cover" />
          </div>
        )}
        <div>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="text-sm"
          />
          {uploading && <p className="text-xs text-blue-600 mt-1">上傳中...</p>}
          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
      </div>
    </div>
  );
}
