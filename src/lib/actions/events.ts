"use server";

import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "./auth-check";

export async function createEvent(formData: FormData) {
  try {
    await requireAdmin();

    await db.insert(events).values({
      sectionTitle: formData.get("sectionTitle") as string,
      date: formData.get("date") as string,
      titleCn: formData.get("titleCn") as string,
      titleEn: formData.get("titleEn") as string,
      speaker: formData.get("speaker") as string,
      speakerTitle: formData.get("speakerTitle") as string,
      location: formData.get("location") as string,
      image: (formData.get("image") as string) || null,
      link: (formData.get("link") as string) || null,
      color: (formData.get("color") as string) || "blue",
      published: formData.get("published") === "on",
      sortOrder: Number(formData.get("sortOrder") || 0),
    });

    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath("/admin/events");
    return { success: true };
  } catch (error) {
    return { error: `新增失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}

export async function updateEvent(formData: FormData) {
  try {
    await requireAdmin();
    const id = formData.get("id") as string;

    await db
      .update(events)
      .set({
        sectionTitle: formData.get("sectionTitle") as string,
        date: formData.get("date") as string,
        titleCn: formData.get("titleCn") as string,
        titleEn: formData.get("titleEn") as string,
        speaker: formData.get("speaker") as string,
        speakerTitle: formData.get("speakerTitle") as string,
        location: formData.get("location") as string,
        image: (formData.get("image") as string) || null,
        link: (formData.get("link") as string) || null,
        color: (formData.get("color") as string) || "blue",
        published: formData.get("published") === "on",
        sortOrder: Number(formData.get("sortOrder") || 0),
        updatedAt: new Date(),
      })
      .where(eq(events.id, id));

    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath("/admin/events");
    return { success: true };
  } catch (error) {
    return { error: `更新失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}

export async function deleteEvent(id: string) {
  try {
    await requireAdmin();
    await db.delete(events).where(eq(events.id, id));

    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath("/admin/events");
    return { success: true };
  } catch (error) {
    return { error: `刪除失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}
