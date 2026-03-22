import { db } from "@/lib/db";
import { associationMembers } from "@/lib/db/schema";
import { asc, eq, count } from "drizzle-orm";

export async function getAssociationMembers() {
  return db.select().from(associationMembers).orderBy(asc(associationMembers.sortOrder));
}

export async function getAssociationMembersPaginated(page: number, pageSize: number = 20) {
  const offset = (page - 1) * pageSize;
  const [data, [{ total }]] = await Promise.all([
    db.select().from(associationMembers).orderBy(asc(associationMembers.sortOrder)).limit(pageSize).offset(offset),
    db.select({ total: count() }).from(associationMembers),
  ]);
  return { data, total, totalPages: Math.ceil(total / pageSize) };
}

export async function getMemberById(id: string) {
  const [member] = await db
    .select()
    .from(associationMembers)
    .where(eq(associationMembers.id, id))
    .limit(1);
  return member || null;
}
