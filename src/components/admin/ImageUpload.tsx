"use client";

import { useState } from "react";
import { ALLOWED_IMAGE_TYPES, uploadFile, validateImageFile } from "@/lib/upload";

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

    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const url = await uploadFile(file);
      setUploadedUrl(url);
      setPreview(url);
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
          <div className="w-24 h-24 rounded overflow-hidden border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
          </div>
        )}
        <div>
          <input
            type="file"
            accept={ALLOWED_IMAGE_TYPES.join(",")}
            onChange={handleFileChange}
            className="text-sm"
          />
          {uploading && <p className="text-xs text-blue-600 mt-1">上傳中...</p>}
          {error && (
            <p className="text-xs text-red-600 mt-1 break-all whitespace-pre-wrap">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
