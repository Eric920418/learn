"use client";

import { useState } from "react";
import { ALLOWED_IMAGE_TYPES, uploadFile, validateImageFile } from "@/lib/upload";

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
      const validationError = validateImageFile(file);
      if (validationError) {
        setError(validationError);
        e.target.value = "";
        return;
      }
    }

    setError("");
    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        setProgress(`上傳中 ${i + 1} / ${files.length}...`);
        uploadedUrls.push(await uploadFile(files[i]));
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
        accept={ALLOWED_IMAGE_TYPES.join(",")}
        multiple
        onChange={handleFilesChange}
        disabled={uploading}
        className="text-sm disabled:opacity-50"
      />
      {uploading && (
        <p className="text-xs text-blue-600 mt-1">{progress}</p>
      )}
      {error && (
        <p className="text-xs text-red-600 mt-1 break-all whitespace-pre-wrap">
          {error}
        </p>
      )}
    </div>
  );
}
