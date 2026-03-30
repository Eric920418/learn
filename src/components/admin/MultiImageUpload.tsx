"use client";

import { useState } from "react";

interface MultiImageUploadProps {
  onUploaded: (urls: string[]) => Promise<{ error?: string }>;
}

export function MultiImageUpload({ onUploaded }: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");

  async function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        setError(`${file.name} 超過 5MB 限制`);
        return;
      }
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setError(`${file.name} 格式不支援，只接受 JPG、PNG、WebP`);
        return;
      }
    }

    setError("");
    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        setProgress(`上傳中 ${i + 1} / ${files.length}...`);
        const formData = new FormData();
        formData.append("file", files[i]);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || `上傳 ${files[i].name} 失敗`);
        }
        uploadedUrls.push(data.url);
      }

      setProgress("儲存中...");
      const result = await onUploaded(uploadedUrls);
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "上傳失敗");
    } finally {
      setUploading(false);
      setProgress("");
      e.target.value = "";
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        新增照片
      </label>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFilesChange}
        disabled={uploading}
        className="text-sm disabled:opacity-50"
      />
      {uploading && (
        <p className="text-xs text-blue-600 mt-1">{progress}</p>
      )}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
