"use server";

import { db } from "@/lib/db";
import { boardMembers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "./auth-check";

export async function createBoardMember(formData: FormData) {
  try {
    await requireAdmin();

    await db.insert(boardMembers).values({
      nameEn: formData.get("nameEn") as string,
      titleEn: formData.get("titleEn") as string,
      titleCn: formData.get("titleCn") as string,
      image: (formData.get("image") as string) || null,
      sortOrder: Number(formData.get("sortOrder") || 0),
    });

    revalidatePath("/about");
    revalidatePath("/admin/board-members");
    return { success: true };
  } catch (error) {
    return { error: `新增失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}

export async function updateBoardMember(formData: FormData) {
  try {
    await requireAdmin();
    const id = formData.get("id") as string;

    await db
      .update(boardMembers)
      .set({
        nameEn: formData.get("nameEn") as string,
        titleEn: formData.get("titleEn") as string,
        titleCn: formData.get("titleCn") as string,
        image: (formData.get("image") as string) || null,
        sortOrder: Number(formData.get("sortOrder") || 0),
        updatedAt: new Date(),
      })
      .where(eq(boardMembers.id, id));

    revalidatePath("/about");
    revalidatePath("/admin/board-members");
    return { success: true };
  } catch (error) {
    return { error: `更新失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}

export async function deleteBoardMember(id: string) {
  try {
    await requireAdmin();
    await db.delete(boardMembers).where(eq(boardMembers.id, id));

    revalidatePath("/about");
    revalidatePath("/admin/board-members");
    return { success: true };
  } catch (error) {
    return { error: `刪除失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}
