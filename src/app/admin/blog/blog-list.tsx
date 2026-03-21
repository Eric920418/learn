"use client";

import Link from "next/link";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deletePost } from "@/lib/actions/blog";

interface Post {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: Date;
}

export function BlogListClient({ posts }: { posts: Post[] }) {
  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <div key={post.id} className="bg-white p-4 rounded-lg border flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{post.title}</span>
              <span className={`px-2 py-0.5 text-xs rounded ${post.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                {post.published ? "已發布" : "草稿"}
              </span>
            </div>
            <p className="text-sm text-gray-500">/{post.slug} | {new Date(post.createdAt).toLocaleDateString("zh-TW")}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/admin/blog/${post.id}`} className="px-3 py-1 text-xs text-blue-600 border border-blue-300 rounded hover:bg-blue-50">
              編輯
            </Link>
            <DeleteButton onDelete={() => deletePost(post.id)} itemName="此文章" />
          </div>
        </div>
      ))}
      {posts.length === 0 && <p className="text-gray-500 text-sm">尚無文章</p>}
    </div>
  );
}
