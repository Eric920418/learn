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
