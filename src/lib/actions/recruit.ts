"use server";

import { db } from "@/lib/db";
import { focusItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "./auth-check";

export async function createFocusItem(formData: FormData) {
  try {
    await requireAdmin();

    await db.insert(focusItems).values({
      titleEn: formData.get("titleEn") as string,
      titleCn: formData.get("titleCn") as string,
      descEn: formData.get("descEn") as string,
      descCn: formData.get("descCn") as string,
      subItems: (formData.get("subItems") as string) || null,
      sortOrder: Number(formData.get("sortOrder") || 0),
    });

    revalidatePath("/recruit");
    revalidatePath("/admin/recruit");
    return { success: true };
  } catch (error) {
    return { error: `新增失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}

export async function updateFocusItem(formData: FormData) {
  try {
    await requireAdmin();
    const id = formData.get("id") as string;

    await db
      .update(focusItems)
      .set({
        titleEn: formData.get("titleEn") as string,
        titleCn: formData.get("titleCn") as string,
        descEn: formData.get("descEn") as string,
        descCn: formData.get("descCn") as string,
        subItems: (formData.get("subItems") as string) || null,
        sortOrder: Number(formData.get("sortOrder") || 0),
      })
      .where(eq(focusItems.id, id));

    revalidatePath("/recruit");
    revalidatePath("/admin/recruit");
    return { success: true };
  } catch (error) {
    return { error: `更新失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}

export async function deleteFocusItem(id: string) {
  try {
    await requireAdmin();
    await db.delete(focusItems).where(eq(focusItems.id, id));

    revalidatePath("/recruit");
    revalidatePath("/admin/recruit");
    return { success: true };
  } catch (error) {
    return { error: `刪除失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}
