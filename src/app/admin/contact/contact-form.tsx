"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BilingualField } from "@/components/admin/BilingualField";
import { FormField } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { ErrorDisplay } from "@/components/admin/ErrorDisplay";
import { updatePageSection } from "@/lib/actions/about";

interface Section {
  id: string;
  pageSlug: string;
  sectionKey: string;
  contentEn: string | null;
  contentCn: string | null;
}

export function ContactForm({
  welcomeSection,
  contactPersonSection,
}: {
  welcomeSection: Section | null;
  contactPersonSection: Section | null;
}) {
  const router = useRouter();
  const [error, setError] = useState("");

  return (
    <div>
      <ErrorDisplay error={error} />

      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">歡迎文字</h2>
        <p className="text-sm text-gray-500 mb-2">顯示在聯絡頁面上方的歡迎段落</p>
        <form
          action={async (f) => {
            const r = await updatePageSection(f);
            if (r.error) setError(r.error);
            else router.refresh();
          }}
          className="bg-white p-4 rounded-lg border space-y-3"
        >
          {welcomeSection && <input type="hidden" name="id" value={welcomeSection.id} />}
          <input type="hidden" name="pageSlug" value="contact" />
          <input type="hidden" name="sectionKey" value="welcome" />
          <BilingualField
            label="歡迎文字"
            nameEn="contentEn"
            nameCn="contentCn"
            defaultValueEn={welcomeSection?.contentEn ?? ""}
            defaultValueCn={welcomeSection?.contentCn ?? ""}
            type="textarea"
          />
          <SubmitButton />
        </form>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">聯絡人</h2>
        <p className="text-sm text-gray-500 mb-2">顯示在聯絡資訊下方，可自由輸入聯絡人姓名、職稱、聯絡方式等，換行會保留</p>
        <form
          action={async (f) => {
            const r = await updatePageSection(f);
            if (r.error) setError(r.error);
            else router.refresh();
          }}
          className="bg-white p-4 rounded-lg border space-y-3"
        >
          {contactPersonSection && <input type="hidden" name="id" value={contactPersonSection.id} />}
          <input type="hidden" name="pageSlug" value="contact" />
          <input type="hidden" name="sectionKey" value="contact_person" />
          <FormField label="聯絡人資訊" name="contentEn" type="textarea" defaultValue={contactPersonSection?.contentEn ?? ""} />
          <input type="hidden" name="contentCn" value="" />
          <SubmitButton />
        </form>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border text-sm text-gray-500">
        <p>聯絡資訊（會址、電話、傳真、Email）請至「全站設定」編輯。</p>
      </div>
    </div>
  );
}
