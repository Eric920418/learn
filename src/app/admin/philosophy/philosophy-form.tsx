"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BilingualField } from "@/components/admin/BilingualField";
import { FormField } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ErrorDisplay } from "@/components/admin/ErrorDisplay";
import { createPhilosophyItem, updatePhilosophyItem, deletePhilosophyItem } from "@/lib/actions/philosophy";

interface PhilosophyItem {
  id: string;
  category: string;
  contentEn: string;
  contentCn: string;
  sortOrder: number;
}

export function PhilosophyForm({ items }: { items: PhilosophyItem[] }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  async function handleCreate(formData: FormData) {
    const result = await createPhilosophyItem(formData);
    if (result.error) setError(result.error);
    else { setShowForm(false); router.refresh(); }
  }

  async function handleUpdate(formData: FormData) {
    const result = await updatePhilosophyItem(formData);
    if (result.error) setError(result.error);
    else router.refresh();
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 text-sm text-white rounded-md"
          style={{ backgroundColor: "var(--primary-navy)" }}
        >
          {showForm ? "取消" : "新增條目"}
        </button>
      </div>

      <ErrorDisplay error={error} />

      {showForm && (
        <form action={handleCreate} className="mb-6 bg-white p-6 rounded-lg border space-y-4">
          <FormField label="分類" name="category" type="select" required options={[{ value: "goal", label: "目標" }, { value: "vision", label: "願景" }]} />
          <BilingualField label="內容" nameEn="contentEn" nameCn="contentCn" type="textarea" required />
          <FormField label="排序" name="sortOrder" type="number" defaultValue={0} />
          <SubmitButton label="新增" />
        </form>
      )}

      <div className="space-y-4">
        {items.map((item) => (
          <form key={item.id} action={handleUpdate} className="bg-white p-6 rounded-lg border space-y-4">
            <input type="hidden" name="id" value={item.id} />
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 text-xs rounded ${item.category === "goal" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
                {item.category === "goal" ? "目標" : "願景"}
              </span>
            </div>
            <FormField label="分類" name="category" type="select" defaultValue={item.category} required options={[{ value: "goal", label: "目標" }, { value: "vision", label: "願景" }]} />
            <BilingualField label="內容" nameEn="contentEn" nameCn="contentCn" defaultValueEn={item.contentEn} defaultValueCn={item.contentCn} type="textarea" required />
            <FormField label="排序" name="sortOrder" type="number" defaultValue={item.sortOrder} />
            <div className="flex items-center gap-3">
              <SubmitButton />
              <DeleteButton onDelete={() => deletePhilosophyItem(item.id)} />
            </div>
          </form>
        ))}
        {items.length === 0 && <p className="text-gray-500 text-sm">尚無資料，請點擊「新增條目」</p>}
      </div>
    </>
  );
}
