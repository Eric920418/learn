"use server";

import { db } from "@/lib/db";
import { heroContent } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "./auth-check";

export async function updateHero(formData: FormData) {
  try {
    await requireAdmin();

    const data = {
      titleLine1: formData.get("titleLine1") as string,
      titleLine2: formData.get("titleLine2") as string,
      subtitleCn: formData.get("subtitleCn") as string,
      subtitleEn: formData.get("subtitleEn") as string,
      announcementText: formData.get("announcementText") as string,
      heroImage: formData.get("heroImage") as string,
      updatedAt: new Date(),
    };

    const existing = await db.select().from(heroContent).limit(1);

    if (existing.length > 0) {
      await db.update(heroContent).set(data).where(eq(heroContent.id, existing[0].id));
    } else {
      await db.insert(heroContent).values(data);
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: `更新失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}
