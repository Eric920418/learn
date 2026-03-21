import Link from "next/link";
import { getAllPosts } from "@/lib/queries/blog";
import { BlogListClient } from "./blog-list";

export default async function BlogAdminPage() {
  const posts = await getAllPosts();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Blog 管理</h1>
        <div className="flex gap-2">
          <Link href="/admin/blog/categories" className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50">分類管理</Link>
          <Link href="/admin/blog/tags" className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50">標籤管理</Link>
          <Link href="/admin/blog/new" className="px-4 py-2 text-sm text-white rounded-md" style={{ backgroundColor: "var(--primary-navy)" }}>
            新增文章
          </Link>
        </div>
      </div>
      <BlogListClient posts={posts} />
    </div>
  );
}
