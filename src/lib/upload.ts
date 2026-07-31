/**
 * 上傳限制與共用邏輯，前後端共用單一真相來源。
 *
 * 大小上限刻意設在 4MB 而非 5MB：Vercel Functions 的 request body 硬上限是
 * 4.5MB，超過會在平台層直接回 413，根本進不到 route handler。4MB 留給
 * multipart 編碼的 overhead。
 */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
export const MAX_UPLOAD_LABEL = "4MB";

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ALLOWED_IMAGE_LABEL = "JPG、PNG、WebP";

/**
 * 影片大小上限。影片走的是瀏覽器直傳 Blob 的路徑（不經過 Vercel Function），
 * 所以不受 4.5MB body 限制；這個上限純粹是為了控制儲存與流量成本。
 */
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
export const MAX_VIDEO_LABEL = "100MB";

/**
 * 刻意不收 video/quicktime（.mov）。iPhone 預設錄的是 HEVC 編碼的 .mov，
 * 管理員在 Mac Safari 上測會正常播放，但 Chrome / Firefox 的訪客完全播不出來 ——
 * 這種錯誤不會有人回報，只會讓內容靜默失效。寧可在上傳當下擋下並要求匯出成 MP4。
 */
export const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"];
export const ALLOWED_VIDEO_LABEL = "MP4、WebM";

/** 通過回傳 null，不通過回傳給使用者看的錯誤訊息。 */
export function validateImageFile(file: File): string | null {
  if (file.size > MAX_UPLOAD_BYTES) {
    return `${file.name} 超過 ${MAX_UPLOAD_LABEL} 限制`;
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return `${file.name} 格式不支援，只接受 ${ALLOWED_IMAGE_LABEL}`;
  }
  return null;
}

/** 通過回傳 null，不通過回傳給使用者看的錯誤訊息。 */
export function validateVideoFile(file: File): string | null {
  if (file.size > MAX_VIDEO_BYTES) {
    return `${file.name} 超過 ${MAX_VIDEO_LABEL} 限制`;
  }
  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
    // .mov 給具體指示，否則管理員只會看到「格式不支援」而不知道下一步該做什麼
    if (
      file.type === "video/quicktime" ||
      file.name.toLowerCase().endsWith(".mov")
    ) {
      return `${file.name} 是 .mov 格式。iPhone 錄製的 .mov 多數瀏覽器播不出來，請先匯出成 MP4 再上傳。`;
    }
    return `${file.name} 格式不支援，只接受 ${ALLOWED_VIDEO_LABEL}`;
  }
  return null;
}

/**
 * 影片在 Blob 上的路徑前綴。
 *
 * 本機開發與正式站共用同一個 Blob store（client upload 沒有本地備援），
 * 所以本機上傳的檔案走 videos/dev/，之後可以用
 * `vercel blob list --prefix videos/dev/` 一次找出來清掉。
 * 伺服器端只驗最外層的 videos/，避免把「用區網 IP 開 dev server」這種
 * 正常情境誤判成攻擊。
 */
export const VIDEO_BLOB_PREFIX = "videos/";
export const VIDEO_BLOB_DEV_PREFIX = "videos/dev/";

const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

/** DB 裡的髒資料直接拼進 iframe src 會造成路徑逃逸，渲染前一定要再驗一次。 */
export function isValidYouTubeId(id: string | null | undefined): id is string {
  return !!id && YOUTUBE_ID_PATTERN.test(id);
}

/**
 * 從各種 YouTube 網址形式取出 11 字元影片 ID，取不到回傳 null。
 * 存 ID 而非整串網址，是為了讓前台能自由決定要用 embed、nocookie 還是縮圖網域。
 */
export function parseYouTubeId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // 已經是純 ID
  if (YOUTUBE_ID_PATTERN.test(trimmed)) return trimmed;

  const match = trimmed.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

/** 上傳單一檔案，成功回傳圖片 URL，失敗一律 throw 帶完整訊息的 Error。 */
export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", { method: "POST", body: formData });

  // 平台層錯誤（例如 Vercel 的 413）回的是 HTML 不是 JSON，直接 res.json()
  // 會拋出 "Unexpected token '<'" 這種看不懂的 parse error，蓋掉真正的原因。
  // 所以先讀成 text，再嘗試解析。
  const raw = await res.text();
  let payload: { url?: string; error?: string } | null = null;
  try {
    payload = JSON.parse(raw) as { url?: string; error?: string };
  } catch {
    payload = null;
  }

  if (!res.ok) {
    if (payload?.error) throw new Error(payload.error);
    if (res.status === 413) {
      throw new Error(
        `${file.name} 太大，伺服器拒絕接收（上限 ${MAX_UPLOAD_LABEL}）`
      );
    }
    throw new Error(
      `上傳 ${file.name} 失敗（HTTP ${res.status} ${res.statusText}）：${
        raw.slice(0, 300) || "伺服器沒有回傳內容"
      }`
    );
  }

  if (!payload?.url) {
    throw new Error(
      `上傳 ${file.name} 失敗：伺服器回應格式不正確 — ${raw.slice(0, 300)}`
    );
  }

  return payload.url;
}
