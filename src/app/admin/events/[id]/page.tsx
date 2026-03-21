import { redirect } from "next/navigation";
import { getEventById } from "@/lib/queries/events";
import { createEvent, updateEvent } from "@/lib/actions/events";
import { FormField } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";

export default async function EventEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const event = isNew ? null : await getEventById(id);

  if (!isNew && !event) redirect("/admin/events");

  async function handleAction(formData: FormData) {
    "use server";
    const action = id === "new" ? createEvent : updateEvent;
    await action(formData);
    redirect("/admin/events");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{isNew ? "新增活動" : "編輯活動"}</h1>
      <form action={handleAction} className="max-w-2xl space-y-4 bg-white p-6 rounded-lg border">
        {!isNew && <input type="hidden" name="id" value={id} />}
        <FormField label="區塊標題" name="sectionTitle" defaultValue={event?.sectionTitle ?? ""} required />
        <FormField label="日期" name="date" defaultValue={event?.date ?? ""} required placeholder="例: 12月26-27日" />
        <FormField label="活動名稱（中文）" name="titleCn" defaultValue={event?.titleCn ?? ""} required />
        <FormField label="活動名稱（英文）" name="titleEn" defaultValue={event?.titleEn ?? ""} required />
        <FormField label="主講人" name="speaker" defaultValue={event?.speaker ?? ""} required />
        <FormField label="主講人頭銜" name="speakerTitle" defaultValue={event?.speakerTitle ?? ""} required />
        <FormField label="地點" name="location" defaultValue={event?.location ?? ""} required />
        <FormField label="活動資訊" name="info" type="textarea" defaultValue={event?.info ?? ""} />
        <FormField label="配色" name="color" type="select" defaultValue={event?.color ?? "blue"} options={[{ value: "blue", label: "藍色" }, { value: "orange", label: "橘色" }]} />
        <FormField label="排序" name="sortOrder" type="number" defaultValue={event?.sortOrder ?? 0} />
        <div className="flex items-center gap-2">
          <input type="checkbox" id="published" name="published" defaultChecked={event?.published ?? true} />
          <label htmlFor="published" className="text-sm">發布</label>
        </div>
        <SubmitButton label={isNew ? "新增" : "儲存"} />
      </form>
    </div>
  );
}
