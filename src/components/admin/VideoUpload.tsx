"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";
import {
  BlobClientTokenExpiredError,
  BlobContentTypeNotAllowedError,
  BlobFileTooLargeError,
} from "@vercel/blob";
import {
  ALLOWED_VIDEO_LABEL,
  ALLOWED_VIDEO_TYPES,
  MAX_VIDEO_LABEL,
  VIDEO_BLOB_DEV_PREFIX,
  VIDEO_BLOB_PREFIX,
  validateVideoFile,
} from "@/lib/upload";
import { discardVideoBlob } from "@/lib/actions/gallery";

interface VideoUploadProps {
  name: string;
  currentUrl?: string | null;
  label?: string;
  /** 讓外層在上傳期間停用送出鈕——中途送出會導頁，把還沒存檔的 100MB 變成孤兒 */
  onUploadingChange?: (uploading: boolean) => void;
}

function isLocalhost() {
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1" || host === "[::1]";
}

/**
 * 用瀏覽器自己解一次影片，確認這個檔案真的播得出來。
 *
 * 擋 .mov 只解決一半問題：iPhone「高效率」匯出的是 .mp4 容器裝 HEVC/H.265，
 * file.type 會是 video/mp4 而通過白名單，但 Firefox 與多數 Android Chrome
 * 解不出來。這個探測至少證明「上傳者這台瀏覽器解得開」——不是全域保證
 * （Safari 解得開 HEVC），所以 README 仍然要求匯出 H.264 + AAC。
 */
function probeDecodable(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const el = document.createElement("video");

    const finish = (ok: boolean) => {
      URL.revokeObjectURL(objectUrl);
      el.removeAttribute("src");
      resolve(ok);
    };

    el.preload = "metadata";
    el.onloadedmetadata = () =>
      finish(el.videoWidth > 0 && Number.isFinite(el.duration));
    el.onerror = () => finish(false);
    // 有些瀏覽器兩個事件都不觸發。給它好處，別讓探測本身卡死上傳流程。
    setTimeout(() => finish(true), 5000);

    el.src = objectUrl;
  });
}

/** Blob 的錯誤轉成管理員看得懂的話。認不出來的一律保留原始訊息，不吞掉。 */
async function describeUploadError(
  err: unknown,
  fileName: string
): Promise<string> {
  // @vercel/blob 與 @vercel/blob/client 共用同一份 chunk，instanceof 跨入口有效
  if (err instanceof BlobFileTooLargeError) {
    return `${fileName} 超過 ${MAX_VIDEO_LABEL} 限制，已被伺服器端拒絕`;
  }
  if (err instanceof BlobContentTypeNotAllowedError) {
    return `${fileName} 的格式不被接受，只支援 ${ALLOWED_VIDEO_LABEL}`;
  }
  if (err instanceof BlobClientTokenExpiredError) {
    return "上傳憑證已過期，請重新整理頁面後再試一次";
  }

  const raw = err instanceof Error ? err.message : "";

  // SDK 在拿不到 token 時，會把我們 route 回的 JSON 錯誤內容整個丟掉，
  // 換成固定的英文字串。真正的原因只能再打一次 GET 問。
  if (raw.includes("client token")) {
    try {
      const res = await fetch("/api/upload/video");
      const data = (await res.json()) as { ready?: boolean; reason?: string };
      if (data.ready === false && data.reason) {
        return `無法取得上傳授權：${data.reason}`;
      }
    } catch {
      // 探測本身也失敗就沿用原始訊息
    }
    return `無法取得上傳授權（${raw}）`;
  }

  return raw || "上傳失敗";
}

export function VideoUpload({
  name,
  currentUrl,
  label = "影片檔案",
  onUploadingChange,
}: VideoUploadProps) {
  const [uploadedUrl, setUploadedUrl] = useState(currentUrl || "");
  const [uploading, setUploading] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [error, setError] = useState("");

  function setUploadingState(next: boolean) {
    setUploading(next);
    onUploadingChange?.(next);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // 先在前端擋一次，省下沒必要的上傳；伺服器端的 token 約束才是真正的防線
    const validationError = validateVideoFile(file);
    if (validationError) {
      setError(validationError);
      e.target.value = "";
      return;
    }

    setError("");
    setUploadingState(true);
    setPercentage(0);

    try {
      if (!(await probeDecodable(file))) {
        throw new Error(
          `${file.name} 在這個瀏覽器解不開，很可能是 HEVC / H.265 編碼或檔案損毀。請改用 H.264 + AAC 的 MP4。`
        );
      }

      // 本機開發跟正式站共用同一個 Blob store，用路徑前綴把測試檔案分流出去
      const prefix = isLocalhost() ? VIDEO_BLOB_DEV_PREFIX : VIDEO_BLOB_PREFIX;
      // 檔名裡的斜線會在 Blob 上長出目錄，先換掉；重名由 server 的 addRandomSuffix 處理
      const safeName = file.name.replace(/[/\\]/g, "_").slice(-120);

      // 這一顆是上一次傳好、但還沒存進 DB 的檔案。換片就等於放棄它，
      // 不主動清掉的話沒有任何 UI 追蹤得到——就是一顆找不回來的 100MB。
      const abandoned =
        uploadedUrl && uploadedUrl !== currentUrl ? uploadedUrl : null;

      const blob = await upload(`${prefix}${safeName}`, file, {
        access: "public",
        handleUploadUrl: "/api/upload/video",
        // 極少數環境 file.type 會是空字串，沒有它 Safari 可能拒播
        contentType: file.type || "video/mp4",
        // 分段平行上傳，單段失敗只重試那一段。SDK 的 retry 包住整個 request
        // body，不開 multipart 的話 100MB 傳到 95% 斷線就是整支重來。
        multipart: true,
        onUploadProgress: (progress) => setPercentage(progress.percentage),
      });

      setUploadedUrl(blob.url);
      if (abandoned) void discardVideoBlob(abandoned);
    } catch (err) {
      setError(await describeUploadError(err, file.name));
    } finally {
      setUploadingState(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input type="hidden" name={name} value={uploadedUrl} />

      <input
        type="file"
        accept={ALLOWED_VIDEO_TYPES.join(",")}
        onChange={handleFileChange}
        disabled={uploading}
        className="text-sm disabled:opacity-50"
      />

      <p className="mt-1 text-xs text-gray-500">
        請上傳 H.264 + AAC 編碼的 MP4（或 WebM），上限 {MAX_VIDEO_LABEL}。iPhone
        的「高效率」格式是 HEVC，訪客的 Chrome / Firefox 播不出來，匯出時請選「最相容」。
      </p>

      {uploading && (
        <div className="mt-2">
          <div className="h-2 w-full overflow-hidden rounded bg-gray-200">
            <div
              className="h-full bg-blue-600 transition-[width] duration-150"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-blue-600">
            {percentage >= 99
              ? "處理中，請稍候…"
              : `上傳中 ${percentage.toFixed(0)}%`}
          </p>
        </div>
      )}

      {!uploading && uploadedUrl && (
        <video
          src={uploadedUrl}
          controls
          playsInline
          preload="metadata"
          className="mt-2 max-h-48 w-full max-w-md rounded border bg-black"
        />
      )}

      {error && (
        <p className="mt-1 text-xs text-red-600 break-all whitespace-pre-wrap">
          {error}
        </p>
      )}
    </div>
  );
}
