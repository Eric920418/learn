import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { siteSettings, pageSections } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export const getSiteSettings = unstable_cache(async () => {
  const [settings] = await db.select().from(siteSettings).limit(1);
  return settings || null;
}, ["site-settings"], { revalidate: 3600, tags: ["site-settings"] });

export async function getPageSection(pageSlug: string, sectionKey: string) {
  const [section] = await db
    .select()
    .from(pageSections)
    .where(and(eq(pageSections.pageSlug, pageSlug), eq(pageSections.sectionKey, sectionKey)))
    .limit(1);
  return section || null;
}

export async function getPageSections(pageSlug: string) {
  return db
    .select()
    .from(pageSections)
    .where(eq(pageSections.pageSlug, pageSlug));
}
