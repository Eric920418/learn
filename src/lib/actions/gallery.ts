"use server";

import { db } from "@/lib/db";
import { galleryAlbums, galleryPhotos } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import { requireAdmin } from "./auth-check";
import { parseYouTubeId } from "@/lib/upload";

/**
 * 多一個 warning：有些操作會「主要動作成功、但 Blob 檔案沒清乾淨」。
 * 當成 error 會讓管理員以為沒刪掉，靜默吞掉則會留下孤兒檔案——影片一份就是
 * 100MB，會一直計費。所以獨立成第三種結果。
 */
type GalleryActionResult =
  | { success: true; albumId?: string; warning?: string }
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

/** 批次清除；回傳清不掉的清單。 */
async function deleteBlobs(
  urls: (string | null | undefined)[]
): Promise<string[]> {
  const failed: string[] = [];
  for (const url of urls) {
    if (!isBlobUrl(url)) continue;
    const failure = await deleteBlob(url);
    if (failure) failed.push(failure);
  }
  return failed;
}

// ============================================
// 相簿 CRUD
// ============================================

export async function createAlbum(
  formData: FormData
): Promise<GalleryActionResult> {
  try {
    await requireAdmin();

    const [album] = await db
      .insert(galleryAlbums)
      .values({
        title: formData.get("title") as string,
        description: (formData.get("description") as string) || null,
        coverImage: (formData.get("coverImage") as string) || null,
        eventDate: formData.get("eventDate") as string,
        published: formData.get("published") === "on",
        sortOrder: Number(formData.get("sortOrder") || 0),
      })
      .returning();

    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    return { success: true, albumId: album.id };
  } catch (error) {
    return {
      error: `新增失敗: ${error instanceof Error ? error.message : "未知錯誤"}`,
    };
  }
}

export async function updateAlbum(
  formData: FormData
): Promise<GalleryActionResult> {
  try {
    await requireAdmin();
    const id = formData.get("id") as string;

    await db
      .update(galleryAlbums)
      .set({
        title: formData.get("title") as string,
        description: (formData.get("description") as string) || null,
        coverImage: (formData.get("coverImage") as string) || null,
        eventDate: formData.get("eventDate") as string,
        published: formData.get("published") === "on",
        sortOrder: Number(formData.get("sortOrder") || 0),
        updatedAt: new Date(),
      })
      .where(eq(galleryAlbums.id, id));

    revalidatePath("/gallery");
    revalidatePath(`/gallery/${id}`);
    revalidatePath("/admin/gallery");
    revalidatePath("/videos");
    return { success: true };
  } catch (error) {
    return {
      error: `更新失敗: ${error instanceof Error ? error.message : "未知錯誤"}`,
    };
  }
}

export async function deleteAlbum(id: string): Promise<GalleryActionResult> {
  try {
    await requireAdmin();

    // 相簿刪掉會 cascade 掉所有媒體，它們的 Blob 檔案就再也沒有東西指向它。
    // 一本有 5 支影片的相簿 = 500MB 孤兒，所以先把 URL 撈出來。
    const media = await db
      .select({
        imageUrl: galleryPhotos.imageUrl,
        videoUrl: galleryPhotos.videoUrl,
      })
      .from(galleryPhotos)
      .where(eq(galleryPhotos.albumId, id));

    const [album] = await db
      .select({ coverImage: galleryAlbums.coverImage })
      .from(galleryAlbums)
      .where(eq(galleryAlbums.id, id))
      .limit(1);

    await db.delete(galleryAlbums).where(eq(galleryAlbums.id, id));

    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    revalidatePath("/videos");

    const failed = await deleteBlobs([
      album?.coverImage,
      ...media.flatMap((m) => [m.imageUrl, m.videoUrl]),
    ]);

    if (failed.length > 0) {
      return {
        success: true,
        warning: `相簿已刪除，但以下 ${failed.length} 個檔案沒能從 Blob 移除，需要手動清理：\n${failed.join(
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

// ============================================
// 相簿內的媒體（照片 + 影片）
// ============================================

/** 新媒體接在現有排序之後。 */
async function nextSortOrder(albumId: string): Promise<number> {
  const existing = await db
    .select({ sortOrder: galleryPhotos.sortOrder })
    .from(galleryPhotos)
    .where(eq(galleryPhotos.albumId, albumId));

  return existing.length > 0
    ? Math.max(...existing.map((p) => p.sortOrder)) + 1
    : 0;
}

export async function addPhotosToAlbum(
  albumId: string,
  photoUrls: string[]
): Promise<GalleryActionResult> {
  try {
    await requireAdmin();

    if (photoUrls.length === 0) return { success: true };

    const start = await nextSortOrder(albumId);

    await db.insert(galleryPhotos).values(
      photoUrls.map((url, i) => ({
        albumId,
        imageUrl: url,
        mediaType: "image" as const,
        sortOrder: start + i,
      }))
    );

    revalidatePath(`/gallery/${albumId}`);
    revalidatePath(`/admin/gallery/${albumId}/photos`);
    return { success: true };
  } catch (error) {
    return {
      error: `新增照片失敗: ${error instanceof Error ? error.message : "未知錯誤"}`,
    };
  }
}

/**
 * 在相簿裡新增一支影片。
 *
 * 封面圖是必填的：它會寫進 imageUrl（NOT NULL），也就是相片牆上顯示的那張圖。
 * 沒有封面的話影片在牆上會是一塊黑色方塊。
 */
export async function addVideoToAlbum(
  albumId: string,
  formData: FormData
): Promise<GalleryActionResult> {
  try {
    await requireAdmin();

    const posterImage = (formData.get("posterImage") as string) || null;
    if (!posterImage) {
      return {
        error: "請先上傳影片封面圖，它會是相片牆上顯示的那張圖",
      };
    }

    const source =
      (formData.get("source") as string) === "youtube" ? "youtube" : "upload";

    let videoUrl: string | null = null;
    let youtubeId: string | null = null;

    if (source === "youtube") {
      const raw = ((formData.get("youtubeUrl") as string) || "").trim();
      if (!raw) return { error: "請填入 YouTube 影片網址" };

      youtubeId = parseYouTubeId(raw);
      if (!youtubeId) {
        const hint = raw.includes("list=")
          ? "這看起來是播放清單網址，請貼單一影片的連結"
          : "請貼完整的影片網址";
        return {
          error: `無法從「${raw}」解析出 YouTube 影片 ID。${hint}`,
        };
      }
    } else {
      videoUrl = (formData.get("videoUrl") as string) || null;
      if (!videoUrl) {
        return { error: "尚未上傳影片檔案，或上傳尚未完成" };
      }
    }

    await db.insert(galleryPhotos).values({
      albumId,
      imageUrl: posterImage,
      caption: (formData.get("caption") as string) || null,
      mediaType: "video",
      videoUrl,
      youtubeId,
      sortOrder: await nextSortOrder(albumId),
    });

    revalidatePath(`/gallery/${albumId}`);
    revalidatePath(`/admin/gallery/${albumId}/photos`);
    revalidatePath("/videos");
    return { success: true };
  } catch (error) {
    return {
      error: `新增影片失敗: ${error instanceof Error ? error.message : "未知錯誤"}`,
    };
  }
}

export async function updatePhoto(
  formData: FormData
): Promise<GalleryActionResult> {
  try {
    await requireAdmin();
    const id = formData.get("id") as string;
    const albumId = formData.get("albumId") as string;

    await db
      .update(galleryPhotos)
      .set({
        caption: (formData.get("caption") as string) || null,
        sortOrder: Number(formData.get("sortOrder") || 0),
      })
      .where(eq(galleryPhotos.id, id));

    revalidatePath(`/gallery/${albumId}`);
    revalidatePath(`/admin/gallery/${albumId}/photos`);
    revalidatePath("/videos");
    return { success: true };
  } catch (error) {
    return {
      error: `更新失敗: ${error instanceof Error ? error.message : "未知錯誤"}`,
    };
  }
}

export async function deletePhoto(
  id: string,
  albumId: string
): Promise<GalleryActionResult> {
  try {
    await requireAdmin();

    const [media] = await db
      .select({
        imageUrl: galleryPhotos.imageUrl,
        videoUrl: galleryPhotos.videoUrl,
      })
      .from(galleryPhotos)
      .where(eq(galleryPhotos.id, id))
      .limit(1);

    // 先刪 DB 列——這是使用者要的結果，必須先確定成功。
    // （反過來先刪 Blob 的話，Blob 已不存在的列會永遠刪不掉。）
    await db.delete(galleryPhotos).where(eq(galleryPhotos.id, id));

    revalidatePath(`/gallery/${albumId}`);
    revalidatePath(`/admin/gallery/${albumId}/photos`);
    revalidatePath("/videos");

    // 再清 Blob。影片一份 100MB，孤兒檔案會一直計費。
    const failed = await deleteBlobs([media?.imageUrl, media?.videoUrl]);
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
 * 這是 client upload 架構的必要配套：檔案先進 Blob、DB 列後寫，中間只要
 * 管理員換一支影片重傳或放棄表單，那顆 100MB 就沒有任何 UI 追蹤得到它。
 */
export async function discardVideoBlob(
  url: string
): Promise<GalleryActionResult> {
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
