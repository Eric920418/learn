"use server";

import { db } from "@/lib/db";
import { aboutAims, aboutDirectors, aboutPurposes, pageSections } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "./auth-check";

// === Aims ===
export async function createAim(formData: FormData) {
  try {
    await requireAdmin();
    await db.insert(aboutAims).values({
      contentEn: formData.get("contentEn") as string,
      contentCn: formData.get("contentCn") as string,
      sortOrder: Number(formData.get("sortOrder") || 0),
    });
    revalidatePath("/about");
    revalidatePath("/admin/about");
    return { success: true };
  } catch (error) {
    return { error: `新增失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}

export async function updateAim(formData: FormData) {
  try {
    await requireAdmin();
    const id = formData.get("id") as string;
    await db.update(aboutAims).set({
      contentEn: formData.get("contentEn") as string,
      contentCn: formData.get("contentCn") as string,
      sortOrder: Number(formData.get("sortOrder") || 0),
    }).where(eq(aboutAims.id, id));
    revalidatePath("/about");
    revalidatePath("/admin/about");
    return { success: true };
  } catch (error) {
    return { error: `更新失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}

export async function deleteAim(id: string) {
  try {
    await requireAdmin();
    await db.delete(aboutAims).where(eq(aboutAims.id, id));
    revalidatePath("/about");
    revalidatePath("/admin/about");
    return { success: true };
  } catch (error) {
    return { error: `刪除失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}

// === Directors ===
export async function createDirector(formData: FormData) {
  try {
    await requireAdmin();
    await db.insert(aboutDirectors).values({
      contentEn: formData.get("contentEn") as string,
      contentCn: formData.get("contentCn") as string,
      sortOrder: Number(formData.get("sortOrder") || 0),
    });
    revalidatePath("/about");
    revalidatePath("/admin/about");
    return { success: true };
  } catch (error) {
    return { error: `新增失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}

export async function updateDirector(formData: FormData) {
  try {
    await requireAdmin();
    const id = formData.get("id") as string;
    await db.update(aboutDirectors).set({
      contentEn: formData.get("contentEn") as string,
      contentCn: formData.get("contentCn") as string,
      sortOrder: Number(formData.get("sortOrder") || 0),
    }).where(eq(aboutDirectors.id, id));
    revalidatePath("/about");
    revalidatePath("/admin/about");
    return { success: true };
  } catch (error) {
    return { error: `更新失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}

export async function deleteDirector(id: string) {
  try {
    await requireAdmin();
    await db.delete(aboutDirectors).where(eq(aboutDirectors.id, id));
    revalidatePath("/about");
    revalidatePath("/admin/about");
    return { success: true };
  } catch (error) {
    return { error: `刪除失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}

// === Purposes ===
export async function createPurpose(formData: FormData) {
  try {
    await requireAdmin();
    await db.insert(aboutPurposes).values({
      contentEn: formData.get("contentEn") as string,
      contentCn: formData.get("contentCn") as string,
      sortOrder: Number(formData.get("sortOrder") || 0),
    });
    revalidatePath("/about");
    revalidatePath("/admin/about");
    return { success: true };
  } catch (error) {
    return { error: `新增失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}

export async function updatePurpose(formData: FormData) {
  try {
    await requireAdmin();
    const id = formData.get("id") as string;
    await db.update(aboutPurposes).set({
      contentEn: formData.get("contentEn") as string,
      contentCn: formData.get("contentCn") as string,
      sortOrder: Number(formData.get("sortOrder") || 0),
    }).where(eq(aboutPurposes.id, id));
    revalidatePath("/about");
    revalidatePath("/admin/about");
    return { success: true };
  } catch (error) {
    return { error: `更新失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}

export async function deletePurpose(id: string) {
  try {
    await requireAdmin();
    await db.delete(aboutPurposes).where(eq(aboutPurposes.id, id));
    revalidatePath("/about");
    revalidatePath("/admin/about");
    return { success: true };
  } catch (error) {
    return { error: `刪除失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}

// === Page Sections ===
export async function updatePageSection(formData: FormData) {
  try {
    await requireAdmin();
    const id = formData.get("id") as string;
    const pageSlug = formData.get("pageSlug") as string;
    const sectionKey = formData.get("sectionKey") as string;

    if (id) {
      await db.update(pageSections).set({
        contentEn: formData.get("contentEn") as string,
        contentCn: formData.get("contentCn") as string,
        updatedAt: new Date(),
      }).where(eq(pageSections.id, id));
    } else {
      await db.insert(pageSections).values({
        pageSlug,
        sectionKey,
        contentEn: formData.get("contentEn") as string,
        contentCn: formData.get("contentCn") as string,
      });
    }

    revalidatePath(`/${pageSlug}`);
    revalidatePath("/admin/about");
    revalidatePath("/admin/recruit");
    return { success: true };
  } catch (error) {
    return { error: `更新失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}
