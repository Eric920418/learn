"use server";

import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "./auth-check";

export async function updateSiteSettings(formData: FormData) {
  try {
    await requireAdmin();

    const data = {
      address: formData.get("address") as string,
      tel: formData.get("tel") as string,
      fax: formData.get("fax") as string,
      email: formData.get("email") as string,
      copyrightText: formData.get("copyrightText") as string,
      updatedAt: new Date(),
    };

    const existing = await db.select().from(siteSettings).limit(1);

    if (existing.length > 0) {
      await db.update(siteSettings).set(data).where(eq(siteSettings.id, existing[0].id));
    } else {
      await db.insert(siteSettings).values(data);
    }

    revalidatePath("/");
    revalidatePath("/contact");
    return { success: true };
  } catch (error) {
    return { error: `更新失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}
