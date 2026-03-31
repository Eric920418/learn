"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BilingualField } from "@/components/admin/BilingualField";
import { FormField } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ErrorDisplay } from "@/components/admin/ErrorDisplay";
import { updatePageSection } from "@/lib/actions/about";
import { createContactPerson, updateContactPerson, deleteContactPerson } from "@/lib/actions/contact";

interface Section {
  id: string;
  pageSlug: string;
  sectionKey: string;
  contentEn: string | null;
  contentCn: string | null;
}

interface ContactPerson {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string | null;
  sortOrder: number;
}

export function ContactForm({
  welcomeSection,
  contactPersons,
}: {
  welcomeSection: Section | null;
  contactPersons: ContactPerson[];
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);

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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">聯絡人</h2>
          <button
            onClick={() => setShowNewForm(!showNewForm)}
            className="px-3 py-1 text-xs text-white rounded"
            style={{ backgroundColor: "var(--primary-navy)" }}
          >
            {showNewForm ? "取消" : "新增聯絡人"}
          </button>
        </div>

        {showNewForm && (
          <form
            action={async (f) => {
              const r = await createContactPerson(f);
              if (r.error) setError(r.error);
              else { setShowNewForm(false); router.refresh(); }
            }}
            className="mb-4 bg-white p-4 rounded-lg border space-y-3"
          >
            <FormField label="姓名" name="name" required />
            <FormField label="職稱" name="title" required />
            <FormField label="Email" name="email" type="email" required />
            <FormField label="電話" name="phone" />
            <FormField label="排序" name="sortOrder" type="number" defaultValue={0} />
            <SubmitButton label="新增" />
          </form>
        )}

        {contactPersons.map((person) => (
          <form
            key={person.id}
            action={async (f) => {
              const r = await updateContactPerson(f);
              if (r.error) setError(r.error);
              else router.refresh();
            }}
            className="mb-3 bg-white p-4 rounded-lg border space-y-3"
          >
            <input type="hidden" name="id" value={person.id} />
            <FormField label="姓名" name="name" defaultValue={person.name} required />
            <FormField label="職稱" name="title" defaultValue={person.title} required />
            <FormField label="Email" name="email" type="email" defaultValue={person.email} required />
            <FormField label="電話" name="phone" defaultValue={person.phone ?? ""} />
            <FormField label="排序" name="sortOrder" type="number" defaultValue={person.sortOrder} />
            <div className="flex items-center gap-3">
              <SubmitButton />
              <DeleteButton onDelete={() => deleteContactPerson(person.id)} />
            </div>
          </form>
        ))}

        {contactPersons.length === 0 && !showNewForm && (
          <p className="text-sm text-gray-500">尚無聯絡人</p>
        )}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border text-sm text-gray-500">
        <p>聯絡資訊（會址、電話、傳真、Email）請至「全站設定」編輯。</p>
      </div>
    </div>
  );
}
