"use server";

import { db } from "@/lib/db";
import { associationMembers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "./auth-check";

export async function createMember(formData: FormData) {
  try {
    await requireAdmin();

    await db.insert(associationMembers).values({
      nameCn: formData.get("nameCn") as string,
      nameEn: formData.get("nameEn") as string,
      workplace: formData.get("workplace") as string,
      email: formData.get("email") as string,
      email2: (formData.get("email2") as string) || null,
      sortOrder: Number(formData.get("sortOrder") || 0),
    });

    revalidatePath("/members");
    revalidatePath("/admin/members");
    return { success: true };
  } catch (error) {
    return { error: `新增失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}

export async function updateMember(formData: FormData) {
  try {
    await requireAdmin();
    const id = formData.get("id") as string;

    await db
      .update(associationMembers)
      .set({
        nameCn: formData.get("nameCn") as string,
        nameEn: formData.get("nameEn") as string,
        workplace: formData.get("workplace") as string,
        email: formData.get("email") as string,
        email2: (formData.get("email2") as string) || null,
        sortOrder: Number(formData.get("sortOrder") || 0),
        updatedAt: new Date(),
      })
      .where(eq(associationMembers.id, id));

    revalidatePath("/members");
    revalidatePath("/admin/members");
    return { success: true };
  } catch (error) {
    return { error: `更新失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}

export async function deleteMember(id: string) {
  try {
    await requireAdmin();
    await db.delete(associationMembers).where(eq(associationMembers.id, id));

    revalidatePath("/members");
    revalidatePath("/admin/members");
    return { success: true };
  } catch (error) {
    return { error: `刪除失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}
