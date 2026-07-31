"use server";

import { db } from "@/lib/db";
import { videos, type VideoSource } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import { requireAdmin } from "./auth-check";
import { parseYouTubeId } from "@/lib/upload";

function revalidateVideos() {
  revalidatePath("/videos");
  revalidatePath("/admin/videos");
}

/**
 * 比專案其他 action 多一個 warning：影片動作有「主要操作成功、但 Blob 檔案
 * 沒清乾淨」這種中間狀態。當成 error 會讓管理員以為沒存到，靜默吞掉則會留下
 * 每份 100MB 的孤兒檔案，所以獨立成第三種結果。
 *
 * 明確標註回傳型別（而非靠推斷）是必要的：不標的話 createVideo 推不出 warning
 * 欄位，呼叫端用 `"warning" in result` 窄化時會拿到 unknown。
 */
type VideoActionResult =
  | { success: true; warning?: string }
  | { error: string };

/** 只清我們自己放在 Vercel Blob 上的檔案；本地 /uploads/ 與外部網址都跳過。 */
function isBlobUrl(url: string | null | undefined): url is string {
  return !!url && url.includes(".vercel-storage.com");
}

/** 回傳失敗描述；成功回傳 null。呼叫端自行決定要當成 error 還是 warning。 */
async function deleteBlob(url: string): Promise<string | null> {
  try {
    await del(url);
    return null;
  } catch (error) {
    return `${url}（${error instanceof Error ? error.message : "未知錯誤"}）`;
  }
}

type SourceFields = {
  source: VideoSource;
  videoUrl: string | null;
  youtubeId: string | null;
  posterImage: string | null;
};

/**
 * 讀出並驗證影片來源欄位。
 *
 * DB 有 CHECK constraint 擋著（videos_source_payload_check），但那是最後一道——
 * 讓它擋到的話管理員會看到 Postgres 的英文 23514 錯誤原文。這裡先驗一次，
 * 目的是給出看得懂的中文訊息。
 *
 * 刻意把不屬於當前來源的欄位寫成 null，避免切換來源後留下上一次的殘值。
 */
function readSourceFields(
  formData: FormData
): { ok: true; values: SourceFields } | { ok: false; error: string } {
  const source: VideoSource =
    (formData.get("source") as string) === "youtube" ? "youtube" : "upload";
  const posterImage = (formData.get("posterImage") as string) || null;

  if (source === "youtube") {
    const raw = ((formData.get("youtubeUrl") as string) || "").trim();
    if (!raw) return { ok: false, error: "請填入 YouTube 影片網址" };

    const youtubeId = parseYouTubeId(raw);
    if (!youtubeId) {
      const hint = raw.includes("list=")
        ? "這看起來是播放清單網址，請貼單一影片的連結"
        : "請貼完整的影片網址";
      return {
        ok: false,
        error: `無法從「${raw}」解析出 YouTube 影片 ID。${hint}`,
      };
    }
    return {
      ok: true,
      values: { source, videoUrl: null, youtubeId, posterImage },
    };
  }

  const videoUrl = (formData.get("videoUrl") as string) || null;
  if (!videoUrl) {
    return { ok: false, error: "尚未上傳影片檔案，或上傳尚未完成" };
  }
  if (!posterImage) {
    return {
      ok: false,
      error: "自架影片必須上傳封面圖，否則前台的影片卡片會是一塊黑色方塊",
    };
  }
  return {
    ok: true,
    values: { source, videoUrl, youtubeId: null, posterImage },
  };
}

export async function createVideo(
  formData: FormData
): Promise<VideoActionResult> {
  try {
    await requireAdmin();

    const parsed = readSourceFields(formData);
    if (!parsed.ok) return { error: parsed.error };

    await db.insert(videos).values({
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      eventDate: (formData.get("eventDate") as string) || null,
      published: formData.get("published") === "on",
      sortOrder: Number(formData.get("sortOrder") || 0),
      ...parsed.values,
    });

    revalidateVideos();
    return { success: true };
  } catch (error) {
    return {
      error: `新增失敗: ${error instanceof Error ? error.message : "未知錯誤"}`,
    };
  }
}

export async function updateVideo(
  formData: FormData
): Promise<VideoActionResult> {
  try {
    await requireAdmin();
    const id = formData.get("id") as string;

    const parsed = readSourceFields(formData);
    if (!parsed.ok) return { error: parsed.error };

    const [before] = await db
      .select({ videoUrl: videos.videoUrl, posterImage: videos.posterImage })
      .from(videos)
      .where(eq(videos.id, id))
      .limit(1);

    await db
      .update(videos)
      .set({
        title: formData.get("title") as string,
        description: (formData.get("description") as string) || null,
        eventDate: (formData.get("eventDate") as string) || null,
        published: formData.get("published") === "on",
        sortOrder: Number(formData.get("sortOrder") || 0),
        updatedAt: new Date(),
        ...parsed.values,
      })
      .where(eq(videos.id, id));

    revalidateVideos();

    // 換掉的舊檔案要清掉，否則每換一次片就漏一份 100MB。
    // 更新本身已經成功了，清不掉只回 warning。
    const replaced = [
      before?.videoUrl !== parsed.values.videoUrl ? before?.videoUrl : null,
      before?.posterImage !== parsed.values.posterImage
        ? before?.posterImage
        : null,
    ];
    const failed: string[] = [];
    for (const url of replaced) {
      if (!isBlobUrl(url)) continue;
      const failure = await deleteBlob(url);
      if (failure) failed.push(failure);
    }

    if (failed.length > 0) {
      return {
        success: true,
        warning: `已更新，但被替換掉的舊檔案沒能從 Blob 移除，需要手動清理：\n${failed.join(
          "\n"
        )}`,
      };
    }

    return { success: true };
  } catch (error) {
    return {
      error: `更新失敗: ${error instanceof Error ? error.message : "未知錯誤"}`,
    };
  }
}

export async function deleteVideo(id: string): Promise<VideoActionResult> {
  try {
    await requireAdmin();

    const [video] = await db
      .select()
      .from(videos)
      .where(eq(videos.id, id))
      .limit(1);

    // 先刪 DB row——這是使用者要的結果，必須先確定成功。
    // （反過來先刪 Blob 的話，Blob 已不存在的 row 會永遠刪不掉。）
    await db.delete(videos).where(eq(videos.id, id));
    revalidateVideos();

    // 再清 Blob。一支 100MB 的孤兒影片會一直計費，所以這件事非做不可；
    // 但它失敗不代表「刪除」失敗，所以用 warning 回報而不是 error，
    // 也不能靜默吞掉——檔案還在的事實必須讓管理員知道。
    const failed: string[] = [];
    for (const url of [video?.videoUrl, video?.posterImage]) {
      if (!isBlobUrl(url)) continue;
      const failure = await deleteBlob(url);
      if (failure) failed.push(failure);
    }

    if (failed.length > 0) {
      return {
        success: true,
        warning: `資料已刪除，但以下檔案沒能從 Blob 移除，需要手動清理：\n${failed.join(
          "\n"
        )}`,
      };
    }

    return { success: true };
  } catch (error) {
    return {
      error: `刪除失敗: ${error instanceof Error ? error.message : "未知錯誤"}`,
    };
  }
}

/**
 * 丟棄一顆已經傳上 Blob、但最終沒有被存進 DB 的影片。
 *
 * 這是 client upload 架構的必要配套：檔案先進 Blob、DB row 後寫，中間只要
 * 管理員換一支影片重傳或放棄表單，那顆 100MB 就沒有任何 UI 追蹤得到它。
 */
export async function discardVideoBlob(url: string): Promise<VideoActionResult> {
  try {
    await requireAdmin();
    if (!isBlobUrl(url)) return { success: true };

    const failure = await deleteBlob(url);
    if (failure) {
      return { error: `清除未使用的影片檔案失敗: ${failure}` };
    }
    return { success: true };
  } catch (error) {
    return {
      error: `清除未使用的影片檔案失敗: ${
        error instanceof Error ? error.message : "未知錯誤"
      }`,
    };
  }
}
