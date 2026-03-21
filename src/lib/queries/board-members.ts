import { db } from "@/lib/db";
import { boardMembers } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";

export async function getBoardMembers() {
  return db.select().from(boardMembers).orderBy(asc(boardMembers.sortOrder));
}

export async function getBoardMemberById(id: string) {
  const [member] = await db.select().from(boardMembers).where(eq(boardMembers.id, id)).limit(1);
  return member || null;
}
