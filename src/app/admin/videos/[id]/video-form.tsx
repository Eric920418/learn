"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/admin/FormField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { VideoUpload } from "@/components/admin/VideoUpload";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { ErrorDisplay } from "@/components/admin/ErrorDisplay";
import { createVideo, updateVideo } from "@/lib/actions/videos";

interface VideoRecord {
  id: string;
  title: string;
  description: string | null;
  source: string;
  videoUrl: string | null;
  youtubeId: string | null;
  posterImage: string | null;
  eventDate: string | null;
  published: boolean;
  sortOrder: number;
}

const SOURCES = [
  { value: "upload", label: "上傳檔案" },
  { value: "youtube", label: "YouTube 連結" },
];

export function VideoForm({ video }: { video: VideoRecord | null }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [uploading, setUploading] = useState(false);
  const [source, setSource] = useState(
    video?.source === "youtube" ? "youtube" : "upload"
  );

  async function handleSubmit(formData: FormData) {
    const result = video
      ? await updateVideo(formData)
      : await createVideo(formData);

    if ("error" in result && result.error) {
      setError(result.error);
      return;
    }

    // 儲存成功但有殘留的 Blob 檔案要清。導頁會讓訊息消失，所以留在原地顯示。
    if ("warning" in result && result.warning) {
      setError("");
      setWarning(result.warning);
      return;
    }

    router.push("/admin/videos");
  }

  return (
    <form
      action={handleSubmit}
      className="max-w-2xl space-y-4 bg-white p-6 rounded-lg border"
    >
      {video && <input type="hidden" name="id" value={video.id} />}

      <ErrorDisplay error={error} />

      {warning && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded text-sm whitespace-pre-wrap break-all">
          {warning}
        </div>
      )}

      <FormField
        label="標題"
        name="title"
        defaultValue={video?.title ?? ""}
        required
      />
      <FormField
        label="活動日期"
        name="eventDate"
        defaultValue={video?.eventDate ?? ""}
        placeholder="例: 2025年12月26日"
      />
      <FormField
        label="描述"
        name="description"
        type="textarea"
        defaultValue={video?.description ?? ""}
      />

      <fieldset>
        <legend className="block text-sm font-medium text-gray-700 mb-1">
          影片來源
        </legend>
        <div className="flex gap-4">
          {SOURCES.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="source"
                value={opt.value}
                checked={source === opt.value}
                onChange={() => setSource(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      {/*
        兩個來源的欄位都保持掛載、只用 CSS 隱藏，這樣切換來源時不會把已經傳好
        但還沒送出的影片 URL 弄丟。被隱藏的那組欄位仍會送出，由 server action
        依 source 決定採用哪一組、另一組寫 null。
      */}
      <div className={source === "upload" ? undefined : "hidden"}>
        <VideoUpload
          name="videoUrl"
          currentUrl={video?.videoUrl}
          onUploadingChange={setUploading}
        />
      </div>
      <div className={source === "youtube" ? undefined : "hidden"}>
        <FormField
          label="YouTube 網址"
          name="youtubeUrl"
          defaultValue={
            video?.youtubeId
              ? `https://www.youtube.com/watch?v=${video.youtubeId}`
              : ""
          }
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </div>

      <ImageUpload
        name="posterImage"
        currentImage={video?.posterImage}
        label={
          source === "upload"
            ? "封面圖（必填，否則前台會是一塊黑色方塊）"
            : "封面圖（留空則自動使用 YouTube 縮圖）"
        }
      />

      <FormField
        label="排序"
        name="sortOrder"
        type="number"
        defaultValue={video?.sortOrder ?? 0}
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="published"
          name="published"
          defaultChecked={video?.published ?? true}
        />
        <label htmlFor="published" className="text-sm">
          發布
        </label>
      </div>

      {/* 上傳中送出會導頁、把元件卸載，那顆還沒寫進 DB 的影片就變成孤兒了 */}
      <SubmitButton label={video ? "儲存" : "新增"} disabled={uploading} />
      {uploading && (
        <p className="text-xs text-gray-500">影片上傳中，完成後才能儲存。</p>
      )}
    </form>
  );
}
