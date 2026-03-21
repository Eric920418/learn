import { redirect } from "next/navigation";
import { getMemberById } from "@/lib/queries/members";
import { createMember, updateMember } from "@/lib/actions/members";
import { FormField } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";

export default async function MemberEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const member = isNew ? null : await getMemberById(id);

  if (!isNew && !member) redirect("/admin/members");

  async function handleAction(formData: FormData) {
    "use server";
    const action = id === "new" ? createMember : updateMember;
    await action(formData);
    redirect("/admin/members");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{isNew ? "新增會員" : "編輯會員"}</h1>
      <form action={handleAction} className="max-w-2xl space-y-4 bg-white p-6 rounded-lg border">
        {!isNew && <input type="hidden" name="id" value={id} />}
        <FormField label="中文姓名" name="nameCn" defaultValue={member?.nameCn ?? ""} required />
        <FormField label="英文姓名" name="nameEn" defaultValue={member?.nameEn ?? ""} required />
        <FormField label="工作單位" name="workplace" defaultValue={member?.workplace ?? ""} required />
        <FormField label="Email" name="email" type="email" defaultValue={member?.email ?? ""} required />
        <FormField label="第二 Email (選填)" name="email2" type="email" defaultValue={member?.email2 ?? ""} />
        <FormField label="排序" name="sortOrder" type="number" defaultValue={member?.sortOrder ?? 0} />
        <SubmitButton label={isNew ? "新增" : "儲存"} />
      </form>
    </div>
  );
}
