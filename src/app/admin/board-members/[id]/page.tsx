import { redirect } from "next/navigation";
import { getBoardMemberById } from "@/lib/queries/board-members";
import { createBoardMember, updateBoardMember } from "@/lib/actions/board-members";
import { FormField } from "@/components/admin/FormField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { SubmitButton } from "@/components/admin/SubmitButton";

export default async function BoardMemberEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const member = isNew ? null : await getBoardMemberById(id);

  if (!isNew && !member) redirect("/admin/board-members");

  async function handleAction(formData: FormData) {
    "use server";
    const action = id === "new" ? createBoardMember : updateBoardMember;
    await action(formData);
    redirect("/admin/board-members");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{isNew ? "新增組織成員" : "編輯組織成員"}</h1>
      <form action={handleAction} className="max-w-2xl space-y-4 bg-white p-6 rounded-lg border">
        {!isNew && <input type="hidden" name="id" value={id} />}
        <FormField label="英文名稱" name="nameEn" defaultValue={member?.nameEn ?? ""} required />
        <FormField label="英文職稱" name="titleEn" defaultValue={member?.titleEn ?? ""} required />
        <FormField label="中文職稱" name="titleCn" defaultValue={member?.titleCn ?? ""} required />
        <ImageUpload name="image" currentImage={member?.image} label="照片" />
        <FormField label="排序" name="sortOrder" type="number" defaultValue={member?.sortOrder ?? 0} />
        <SubmitButton label={isNew ? "新增" : "儲存"} />
      </form>
    </div>
  );
}
