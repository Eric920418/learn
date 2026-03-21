import { db } from "@/lib/db";
import { posts, categories, tags } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getPublishedPosts() {
  return db
    .select()
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.createdAt));
}

export async function getAllPosts() {
  return db.select().from(posts).orderBy(desc(posts.createdAt));
}

export async function getPostBySlug(slug: string) {
  const [post] = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);
  return post || null;
}

export async function getPostById(id: string) {
  const [post] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return post || null;
}

export async function getCategories() {
  return db.select().from(categories).orderBy(categories.name);
}

export async function getTags() {
  return db.select().from(tags).orderBy(tags.name);
}
