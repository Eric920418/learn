"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BilingualField } from "@/components/admin/BilingualField";
import { FormField } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ErrorDisplay } from "@/components/admin/ErrorDisplay";
import {
  createAim, updateAim, deleteAim,
  createDirector, updateDirector, deleteDirector,
  createPurpose, updatePurpose, deletePurpose,
  updatePageSection,
} from "@/lib/actions/about";

interface Item { id: string; contentEn: string; contentCn: string; sortOrder: number; }
interface Section { id: string; pageSlug: string; sectionKey: string; contentEn: string | null; contentCn: string | null; }

function CrudSection({
  title,
  items,
  onCreate,
  onUpdate,
  onDelete,
}: {
  title: string;
  items: Item[];
  onCreate: (f: FormData) => Promise<{ error?: string }>;
  onUpdate: (f: FormData) => Promise<{ error?: string }>;
  onDelete: (id: string) => Promise<{ error?: string }>;
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">{title}</h2>
        <button onClick={() => setShowForm(!showForm)} className="px-3 py-1 text-xs text-white rounded" style={{ backgroundColor: "var(--primary-navy)" }}>
          {showForm ? "取消" : "新增"}
        </button>
      </div>
      <ErrorDisplay error={error} />
      {showForm && (
        <form action={async (f) => { const r = await onCreate(f); if (r.error) setError(r.error); else { setShowForm(false); router.refresh(); } }} className="mb-4 bg-white p-4 rounded-lg border space-y-3">
          <BilingualField label="內容" nameEn="contentEn" nameCn="contentCn" type="textarea" required />
          <FormField label="排序" name="sortOrder" type="number" defaultValue={0} />
          <SubmitButton label="新增" />
        </form>
      )}
      {items.map((item) => (
        <form key={item.id} action={async (f) => { const r = await onUpdate(f); if (r.error) setError(r.error); else router.refresh(); }} className="mb-3 bg-white p-4 rounded-lg border space-y-3">
          <input type="hidden" name="id" value={item.id} />
          <BilingualField label="內容" nameEn="contentEn" nameCn="contentCn" defaultValueEn={item.contentEn} defaultValueCn={item.contentCn} type="textarea" required />
          <FormField label="排序" name="sortOrder" type="number" defaultValue={item.sortOrder} />
          <div className="flex items-center gap-3">
            <SubmitButton />
            <DeleteButton onDelete={() => onDelete(item.id)} />
          </div>
        </form>
      ))}
      {items.length === 0 && !showForm && <p className="text-sm text-gray-500">尚無資料</p>}
    </div>
  );
}

export function AboutForm({
  aims, directors, purposes, sections,
}: {
  aims: Item[]; directors: Item[]; purposes: Item[]; sections: Section[];
}) {
  const router = useRouter();
  const [error, setError] = useState("");

  const leadershipSection = sections.find(s => s.sectionKey === "leadership_quote");
  const directorsPowerSection = sections.find(s => s.sectionKey === "directors_power");

  return (
    <div>
      <ErrorDisplay error={error} />

      <CrudSection title="Our Aim 我們的目標" items={aims} onCreate={createAim} onUpdate={updateAim} onDelete={deleteAim} />
      <CrudSection title="Why Have Directors 為什麼設置理事" items={directors} onCreate={createDirector} onUpdate={updateDirector} onDelete={deleteDirector} />
      <CrudSection title="What is the association for 學會目的" items={purposes} onCreate={createPurpose} onUpdate={updatePurpose} onDelete={deletePurpose} />

      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">領導力引言</h2>
        <form action={async (f) => { const r = await updatePageSection(f); if (r.error) setError(r.error); else router.refresh(); }} className="bg-white p-4 rounded-lg border space-y-3">
          {leadershipSection && <input type="hidden" name="id" value={leadershipSection.id} />}
          <input type="hidden" name="pageSlug" value="about" />
          <input type="hidden" name="sectionKey" value="leadership_quote" />
          <BilingualField label="引言內容" nameEn="contentEn" nameCn="contentCn" defaultValueEn={leadershipSection?.contentEn ?? ""} defaultValueCn={leadershipSection?.contentCn ?? ""} type="textarea" />
          <SubmitButton />
        </form>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">Directors IS POWER</h2>
        <form action={async (f) => { const r = await updatePageSection(f); if (r.error) setError(r.error); else router.refresh(); }} className="bg-white p-4 rounded-lg border space-y-3">
          {directorsPowerSection && <input type="hidden" name="id" value={directorsPowerSection.id} />}
          <input type="hidden" name="pageSlug" value="about" />
          <input type="hidden" name="sectionKey" value="directors_power" />
          <BilingualField label="內容" nameEn="contentEn" nameCn="contentCn" defaultValueEn={directorsPowerSection?.contentEn ?? ""} defaultValueCn={directorsPowerSection?.contentCn ?? ""} type="textarea" />
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
