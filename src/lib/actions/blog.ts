"use server";

import { db } from "@/lib/db";
import { posts, categories, tags, postTags } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "./auth-check";

// === Posts ===
export async function createPost(formData: FormData) {
  try {
    const session = await requireAdmin();

    await db.insert(posts).values({
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      content: formData.get("content") as string,
      excerpt: (formData.get("excerpt") as string) || null,
      coverImage: (formData.get("coverImage") as string) || null,
      published: formData.get("published") === "on",
      authorId: session.user.id,
      categoryId: (formData.get("categoryId") as string) || null,
    });

    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    return { success: true };
  } catch (error) {
    return { error: `新增失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}

export async function updatePost(formData: FormData) {
  try {
    await requireAdmin();
    const id = formData.get("id") as string;

    await db
      .update(posts)
      .set({
        title: formData.get("title") as string,
        slug: formData.get("slug") as string,
        content: formData.get("content") as string,
        excerpt: (formData.get("excerpt") as string) || null,
        coverImage: (formData.get("coverImage") as string) || null,
        published: formData.get("published") === "on",
        categoryId: (formData.get("categoryId") as string) || null,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id));

    const slug = formData.get("slug") as string;
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/admin/blog");
    return { success: true };
  } catch (error) {
    return { error: `更新失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}

export async function deletePost(id: string) {
  try {
    await requireAdmin();
    await db.delete(postTags).where(eq(postTags.postId, id));
    await db.delete(posts).where(eq(posts.id, id));

    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    return { success: true };
  } catch (error) {
    return { error: `刪除失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}

// === Categories ===
export async function createCategory(formData: FormData) {
  try {
    await requireAdmin();

    await db.insert(categories).values({
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
    });

    revalidatePath("/admin/blog");
    return { success: true };
  } catch (error) {
    return { error: `新增失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}

export async function deleteCategory(id: string) {
  try {
    await requireAdmin();
    await db.delete(categories).where(eq(categories.id, id));
    revalidatePath("/admin/blog");
    return { success: true };
  } catch (error) {
    return { error: `刪除失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}

// === Tags ===
export async function createTag(formData: FormData) {
  try {
    await requireAdmin();

    await db.insert(tags).values({
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
    });

    revalidatePath("/admin/blog");
    return { success: true };
  } catch (error) {
    return { error: `新增失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}

export async function deleteTag(id: string) {
  try {
    await requireAdmin();
    await db.delete(tags).where(eq(tags.id, id));
    revalidatePath("/admin/blog");
    return { success: true };
  } catch (error) {
    return { error: `刪除失敗: ${error instanceof Error ? error.message : "未知錯誤"}` };
  }
}
