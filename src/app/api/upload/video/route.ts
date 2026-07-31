import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { auth } from "@/auth";
import {
  ALLOWED_VIDEO_TYPES,
  MAX_VIDEO_BYTES,
  VIDEO_BLOB_PREFIX,
} from "@/lib/upload";

/** 檢查上傳前提。都 OK 回 null，否則回一句管理員看得懂的原因。 */
async function checkReadiness(): Promise<string | null> {
  // client upload 沒有「退回本地檔案系統」這個選項——沒有 token 就簽不出憑證。
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return "伺服器未設定 BLOB_READ_WRITE_TOKEN。影片必須直傳 Vercel Blob，沒有本地儲存的備援路徑。";
  }

  const session = await auth();
  if (!session) return "登入狀態已失效，請重新登入後再試一次";
  if (session.user.role !== "admin") return "需要管理員權限";

  return null;
}

/**
 * 上傳前提探測。
 *
 * 存在的唯一理由：@vercel/blob 的 upload() 在拿不到 token 時，會把我們回的
 * JSON 錯誤內容整個丟掉，一律換成英文的 "Failed to retrieve the client token"
 * （node_modules/@vercel/blob/dist/client.js:238）。前端只能在失敗之後再打
 * 這支 GET，才問得到真正的原因是「沒登入」還是「伺服器沒設 token」。
 */
export async function GET() {
  const reason = await checkReadiness();
  return NextResponse.json(reason ? { ready: false, reason } : { ready: true });
}

/**
 * 影片上傳的授權端點。
 *
 * 和 /api/upload（圖片）不同，檔案**不會**經過這支 function——它只負責簽發一張
 * 受限的 client token，瀏覽器拿著 token 直接把檔案傳給 Vercel Blob。
 * 這是繞過 Vercel Functions 4.5MB request body 硬限制的唯一辦法。
 *
 * 刻意不實作 onUploadCompleted：那是 Blob 服務反向呼叫我們的 URL，localhost
 * 收不到。把寫 DB 的邏輯放在那裡，等於本地永遠測不出來、上線才發現。
 * 改由前端拿到 URL 後送表單，交給 server action 寫入。
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as HandleUploadBody;

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const reason = await checkReadiness();
        if (reason) throw new Error(reason);

        // pathname 由瀏覽器決定並被寫進 token，不驗的話等於開放整個 store 任意寫。
        // 只驗最外層前綴，讓「用區網 IP 開 dev server」這種正常情境不會被誤擋。
        if (!pathname.startsWith(VIDEO_BLOB_PREFIX)) {
          throw new Error(`上傳路徑必須以 ${VIDEO_BLOB_PREFIX} 開頭`);
        }

        // 這兩個約束會被編碼進 client token 並以 HMAC 簽章保護，由 Blob 服務端
        // 強制執行。是真的伺服器端驗證——繞過我們的 UI 直接呼叫也一樣擋得住。
        return {
          allowedContentTypes: ALLOWED_VIDEO_TYPES,
          maximumSizeInBytes: MAX_VIDEO_BYTES,
          addRandomSuffix: true,
        };
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : "上傳授權失敗";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
