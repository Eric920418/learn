import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import {
  ALLOWED_IMAGE_LABEL,
  ALLOWED_IMAGE_TYPES,
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_LABEL,
} from "@/lib/upload";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "未授權" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "未提供檔案" }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: `檔案大小不能超過 ${MAX_UPLOAD_LABEL}` },
        { status: 400 }
      );
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `只支援 ${ALLOWED_IMAGE_LABEL} 格式` },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    // 有 Vercel Blob token → 用 Vercel Blob（生產環境）
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import("@vercel/blob");
      const blob = await put(`uploads/${filename}`, file, {
        access: "public",
      });
      return NextResponse.json({ url: blob.url });
    }

    // 部署在 Vercel 上卻沒有 token → 直接失敗，不要退回本地檔案系統。
    // Vercel 的 filesystem 是唯讀且每次部署重建，寫進去不是拋 EROFS 就是靜默遺失，
    // 而且錯誤訊息會指向 fs，害人往錯的方向查。
    if (process.env.VERCEL) {
      return NextResponse.json(
        {
          error:
            "伺服器未設定 BLOB_READ_WRITE_TOKEN，無法上傳。請到 Vercel 專案的環境變數設定後重新部署。",
        },
        { status: 500 }
      );
    }

    // 本地開發：沒有 token 就存到 /public/uploads/
    const uploadsDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = join(uploadsDir, filename);
    await writeFile(filePath, buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    const message = error instanceof Error ? error.message : "上傳失敗";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
