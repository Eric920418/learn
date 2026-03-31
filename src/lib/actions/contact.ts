"use server";

import { db } from "@/lib/db";
import { contactPersons } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "./auth-check";

export async function createContactPerson(formData: FormData) {
  try {
    await requireAdmin();
    await db.insert(contactPersons).values({
      name: formData.get("name") as string,
      title: formData.get("title") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || null,
      sortOrder: Number(formData.get("sortOrder") || 0),
    });
    revalidatePath("/contact");
    revalidatePath("/admin/contact");
    return { success: true };
  } catch (error) {
    return { error: `新增失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}

export async function updateContactPerson(formData: FormData) {
  try {
    await requireAdmin();
    const id = formData.get("id") as string;
    await db.update(contactPersons).set({
      name: formData.get("name") as string,
      title: formData.get("title") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || null,
      sortOrder: Number(formData.get("sortOrder") || 0),
      updatedAt: new Date(),
    }).where(eq(contactPersons.id, id));
    revalidatePath("/contact");
    revalidatePath("/admin/contact");
    return { success: true };
  } catch (error) {
    return { error: `更新失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}

export async function deleteContactPerson(id: string) {
  try {
    await requireAdmin();
    await db.delete(contactPersons).where(eq(contactPersons.id, id));
    revalidatePath("/contact");
    revalidatePath("/admin/contact");
    return { success: true };
  } catch (error) {
    return { error: `刪除失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}
