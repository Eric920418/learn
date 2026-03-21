import { getTags } from "@/lib/queries/blog";
import { TagsForm } from "./tags-form";

export default async function TagsPage() {
  const tags = await getTags();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">標籤管理</h1>
      <TagsForm tags={tags} />
    </div>
  );
}
