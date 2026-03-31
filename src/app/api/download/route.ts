import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "缺少 url 參數" }, { status: 400 });
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json({ error: "無法取得圖片" }, { status: 502 });
    }

    const blob = await response.blob();
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const ext = contentType.split("/")[1]?.split(";")[0] || "jpg";

    const filename = request.nextUrl.searchParams.get("filename") || "poster";
    const safeFilename = filename.replace(/[^\w\u4e00-\u9fff\s-]/g, "").trim() || "poster";

    return new NextResponse(blob, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(safeFilename)}.${ext}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "下載失敗";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
