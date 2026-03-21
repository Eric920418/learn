import { db } from "@/lib/db";
import { focusItems } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export async function getFocusItems() {
  return db.select().from(focusItems).orderBy(asc(focusItems.sortOrder));
}
