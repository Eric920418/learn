import { redirect } from "next/navigation";
import { getAlbumById } from "@/lib/queries/gallery";
import { createAlbum, updateAlbum } from "@/lib/actions/gallery";
import { FormField } from "@/components/admin/FormField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { SubmitButton } from "@/components/admin/SubmitButton";

export default async function AlbumEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  const album = isNew ? null : await getAlbumById(id);

  if (!isNew && !album) redirect("/admin/gallery");

  async function handleAction(formData: FormData) {
    "use server";
    if (id === "new") {
      const result = await createAlbum(formData);
      if ("albumId" in result && result.albumId) {
        redirect(`/admin/gallery/${result.albumId}/photos`);
      }
      redirect("/admin/gallery");
    } else {
      await updateAlbum(formData);
      redirect("/admin/gallery");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {isNew ? "新增相簿" : "編輯相簿"}
      </h1>
      <form
        action={handleAction}
        className="max-w-2xl space-y-4 bg-white p-6 rounded-lg border"
      >
        {!isNew && <input type="hidden" name="id" value={id} />}
        <FormField
          label="相簿標題"
          name="title"
          defaultValue={album?.title ?? ""}
        />
        <FormField
          label="活動日期"
          name="eventDate"
          defaultValue={album?.eventDate ?? ""}
          placeholder="例: 2025年12月26日"
        />
        <FormField
          label="描述"
          name="description"
          type="textarea"
          defaultValue={album?.description ?? ""}
        />
        <ImageUpload
          name="coverImage"
          currentImage={album?.coverImage}
          label="封面圖片（留空則使用第一張照片）"
        />
        <FormField
          label="排序"
          name="sortOrder"
          type="number"
          defaultValue={album?.sortOrder ?? 0}
        />
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            name="published"
            defaultChecked={album?.published ?? true}
          />
          <label htmlFor="published" className="text-sm">
            發布
          </label>
        </div>
        <SubmitButton label={isNew ? "新增並管理照片" : "儲存"} />
      </form>
    </div>
  );
}
