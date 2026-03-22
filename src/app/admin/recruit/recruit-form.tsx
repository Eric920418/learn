"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BilingualField } from "@/components/admin/BilingualField";
import { FormField } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ErrorDisplay } from "@/components/admin/ErrorDisplay";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { createFocusItem, updateFocusItem, deleteFocusItem } from "@/lib/actions/recruit";
import { updatePageSection } from "@/lib/actions/about";

interface FocusItem {
  id: string; titleEn: string; titleCn: string; descEn: string; descCn: string;
  subItems: string | null; sortOrder: number;
}
interface Section { id: string; pageSlug: string; sectionKey: string; contentEn: string | null; contentCn: string | null; }

export function RecruitForm({ focusItems, sections }: { focusItems: FocusItem[]; sections: Section[] }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const seminarsSection = sections.find(s => s.sectionKey === "seminars_text");
  const researchSection = sections.find(s => s.sectionKey === "research_text");
  const seminarsImg1 = sections.find(s => s.sectionKey === "seminars_img1");
  const seminarsImg2 = sections.find(s => s.sectionKey === "seminars_img2");
  const seminarsImg3 = sections.find(s => s.sectionKey === "seminars_img3");
  const seminarsImg4 = sections.find(s => s.sectionKey === "seminars_img4");

  return (
    <div>
      <ErrorDisplay error={error} />

      {/* Focus Items */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">專注項目</h2>
          <button onClick={() => setShowForm(!showForm)} className="px-3 py-1 text-xs text-white rounded" style={{ backgroundColor: "var(--primary-navy)" }}>
            {showForm ? "取消" : "新增"}
          </button>
        </div>

        {showForm && (
          <form action={async (f) => { const r = await createFocusItem(f); if (r.error) setError(r.error); else { setShowForm(false); router.refresh(); }}} className="mb-4 bg-white p-4 rounded-lg border space-y-3">
            <BilingualField label="標題" nameEn="titleEn" nameCn="titleCn" required />
            <BilingualField label="描述" nameEn="descEn" nameCn="descCn" required />
            <FormField label="子項目 (JSON, 選填)" name="subItems" type="textarea" placeholder='["項目1", "項目2"]' />
            <FormField label="排序" name="sortOrder" type="number" defaultValue={0} />
            <SubmitButton label="新增" />
          </form>
        )}

        {focusItems.map((item) => (
          <form key={item.id} action={async (f) => { const r = await updateFocusItem(f); if (r.error) setError(r.error); else router.refresh(); }} className="mb-3 bg-white p-4 rounded-lg border space-y-3">
            <input type="hidden" name="id" value={item.id} />
            <BilingualField label="標題" nameEn="titleEn" nameCn="titleCn" defaultValueEn={item.titleEn} defaultValueCn={item.titleCn} required />
            <BilingualField label="描述" nameEn="descEn" nameCn="descCn" defaultValueEn={item.descEn} defaultValueCn={item.descCn} required />
            <FormField label="子項目 (JSON, 選填)" name="subItems" type="textarea" defaultValue={item.subItems ?? ""} />
            <FormField label="排序" name="sortOrder" type="number" defaultValue={item.sortOrder} />
            <div className="flex items-center gap-3">
              <SubmitButton />
              <DeleteButton onDelete={() => deleteFocusItem(item.id)} />
            </div>
          </form>
        ))}
      </div>

      {/* Seminars Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">研討會及繼續教育 文字</h2>
        <form action={async (f) => { const r = await updatePageSection(f); if (r.error) setError(r.error); else router.refresh(); }} className="bg-white p-4 rounded-lg border space-y-3">
          {seminarsSection && <input type="hidden" name="id" value={seminarsSection.id} />}
          <input type="hidden" name="pageSlug" value="recruit" />
          <input type="hidden" name="sectionKey" value="seminars_text" />
          <BilingualField label="研討會內容" nameEn="contentEn" nameCn="contentCn" defaultValueEn={seminarsSection?.contentEn ?? ""} defaultValueCn={seminarsSection?.contentCn ?? ""} type="textarea" />
          <SubmitButton />
        </form>
      </div>

      {/* Seminars Images */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">研討會及繼續教育 圖片</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "上排左圖", key: "seminars_img1", data: seminarsImg1 },
            { label: "上排右圖", key: "seminars_img2", data: seminarsImg2 },
            { label: "下排左圖", key: "seminars_img3", data: seminarsImg3 },
            { label: "下排右圖", key: "seminars_img4", data: seminarsImg4 },
          ].map((item) => (
            <form key={item.key} action={async (f) => { const r = await updatePageSection(f); if (r.error) setError(r.error); else router.refresh(); }} className="bg-white p-4 rounded-lg border space-y-3">
              {item.data && <input type="hidden" name="id" value={item.data.id} />}
              <input type="hidden" name="pageSlug" value="recruit" />
              <input type="hidden" name="sectionKey" value={item.key} />
              <ImageUpload name="contentEn" currentImage={item.data?.contentEn} label={item.label} />
              <input type="hidden" name="contentCn" value="" />
              <SubmitButton label="儲存" />
            </form>
          ))}
        </div>
      </div>

      {/* Research Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">研究與發展 文字</h2>
        <form action={async (f) => { const r = await updatePageSection(f); if (r.error) setError(r.error); else router.refresh(); }} className="bg-white p-4 rounded-lg border space-y-3">
          {researchSection && <input type="hidden" name="id" value={researchSection.id} />}
          <input type="hidden" name="pageSlug" value="recruit" />
          <input type="hidden" name="sectionKey" value="research_text" />
          <BilingualField label="研究發展內容" nameEn="contentEn" nameCn="contentCn" defaultValueEn={researchSection?.contentEn ?? ""} defaultValueCn={researchSection?.contentCn ?? ""} type="textarea" />
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
