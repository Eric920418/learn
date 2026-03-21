"use server";

import { db } from "@/lib/db";
import { philosophyItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "./auth-check";

export async function createPhilosophyItem(formData: FormData) {
  try {
    await requireAdmin();

    await db.insert(philosophyItems).values({
      category: formData.get("category") as string,
      contentEn: formData.get("contentEn") as string,
      contentCn: formData.get("contentCn") as string,
      sortOrder: Number(formData.get("sortOrder") || 0),
    });

    revalidatePath("/");
    revalidatePath("/philosophy");
    revalidatePath("/admin/philosophy");
    return { success: true };
  } catch (error) {
    return { error: `新增失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}

export async function updatePhilosophyItem(formData: FormData) {
  try {
    await requireAdmin();
    const id = formData.get("id") as string;

    await db
      .update(philosophyItems)
      .set({
        category: formData.get("category") as string,
        contentEn: formData.get("contentEn") as string,
        contentCn: formData.get("contentCn") as string,
        sortOrder: Number(formData.get("sortOrder") || 0),
        updatedAt: new Date(),
      })
      .where(eq(philosophyItems.id, id));

    revalidatePath("/");
    revalidatePath("/philosophy");
    revalidatePath("/admin/philosophy");
    return { success: true };
  } catch (error) {
    return { error: `更新失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}

export async function deletePhilosophyItem(id: string) {
  try {
    await requireAdmin();
    await db.delete(philosophyItems).where(eq(philosophyItems.id, id));

    revalidatePath("/");
    revalidatePath("/philosophy");
    revalidatePath("/admin/philosophy");
    return { success: true };
  } catch (error) {
    return { error: `刪除失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}
