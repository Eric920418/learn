import { redirect } from "next/navigation";
import { getPostById, getCategories } from "@/lib/queries/blog";
import { createPost, updatePost } from "@/lib/actions/blog";
import { FormField } from "@/components/admin/FormField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { SubmitButton } from "@/components/admin/SubmitButton";

export default async function BlogEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const [post, categories] = await Promise.all([
    isNew ? null : getPostById(id),
    getCategories(),
  ]);

  if (!isNew && !post) redirect("/admin/blog");

  async function handleAction(formData: FormData) {
    "use server";
    const action = id === "new" ? createPost : updatePost;
    await action(formData);
    redirect("/admin/blog");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{isNew ? "新增文章" : "編輯文章"}</h1>
      <form action={handleAction} className="max-w-3xl space-y-4 bg-white p-6 rounded-lg border">
        {!isNew && <input type="hidden" name="id" value={id} />}
        <FormField label="標題" name="title" defaultValue={post?.title ?? ""} required />
        <FormField label="Slug (網址)" name="slug" defaultValue={post?.slug ?? ""} required placeholder="my-post-title" />
        <FormField label="摘要" name="excerpt" type="textarea" defaultValue={post?.excerpt ?? ""} />
        <FormField label="內容" name="content" type="textarea" defaultValue={post?.content ?? ""} />
        <ImageUpload name="coverImage" currentImage={post?.coverImage} label="封面圖片" />
        <FormField
          label="分類"
          name="categoryId"
          type="select"
          defaultValue={post?.categoryId ?? ""}
          options={[
            { value: "", label: "無分類" },
            ...categories.map((c) => ({ value: c.id, label: c.name })),
          ]}
        />
        <div className="flex items-center gap-2">
          <input type="checkbox" id="published" name="published" defaultChecked={post?.published ?? false} />
          <label htmlFor="published" className="text-sm">發布</label>
        </div>
        <SubmitButton label={isNew ? "新增" : "儲存"} />
      </form>
    </div>
  );
}
