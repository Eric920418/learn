"use server";

import { db } from "@/lib/db";
import { galleryAlbums, galleryPhotos } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "./auth-check";

// ============================================
// 相簿 CRUD
// ============================================

export async function createAlbum(formData: FormData) {
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

export async function updateAlbum(formData: FormData) {
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
    return { success: true };
  } catch (error) {
    return {
      error: `更新失敗: ${error instanceof Error ? error.message : "未知錯誤"}`,
    };
  }
}

export async function deleteAlbum(id: string) {
  try {
    await requireAdmin();
    await db.delete(galleryAlbums).where(eq(galleryAlbums.id, id));

    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    return { success: true };
  } catch (error) {
    return {
      error: `刪除失敗: ${error instanceof Error ? error.message : "未知錯誤"}`,
    };
  }
}

// ============================================
// 照片管理
// ============================================

export async function addPhotosToAlbum(albumId: string, photoUrls: string[]) {
  try {
    await requireAdmin();

    if (photoUrls.length === 0) return { success: true };

    const existing = await db
      .select({ sortOrder: galleryPhotos.sortOrder })
      .from(galleryPhotos)
      .where(eq(galleryPhotos.albumId, albumId));

    const maxSort =
      existing.length > 0
        ? Math.max(...existing.map((p) => p.sortOrder))
        : -1;

    await db.insert(galleryPhotos).values(
      photoUrls.map((url, i) => ({
        albumId,
        imageUrl: url,
        sortOrder: maxSort + 1 + i,
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

export async function updatePhoto(formData: FormData) {
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
    return { success: true };
  } catch (error) {
    return {
      error: `更新失敗: ${error instanceof Error ? error.message : "未知錯誤"}`,
    };
  }
}

export async function deletePhoto(id: string, albumId: string) {
  try {
    await requireAdmin();
    await db.delete(galleryPhotos).where(eq(galleryPhotos.id, id));

    revalidatePath(`/gallery/${albumId}`);
    revalidatePath(`/admin/gallery/${albumId}/photos`);
    return { success: true };
  } catch (error) {
    return {
      error: `刪除失敗: ${error instanceof Error ? error.message : "未知錯誤"}`,
    };
  }
}
