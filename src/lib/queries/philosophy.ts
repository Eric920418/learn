import { db } from "@/lib/db";
import { philosophyItems } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export async function getPhilosophyItems() {
  return db.select().from(philosophyItems).orderBy(asc(philosophyItems.sortOrder));
}
