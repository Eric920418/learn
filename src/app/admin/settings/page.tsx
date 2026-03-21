import { redirect } from "next/navigation";
import { getSiteSettings } from "@/lib/queries/settings";
import { updateSiteSettings } from "@/lib/actions/settings";
import { FormField } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";

export default async function SettingsPage() {
  const settings = await getSiteSettings();

  async function handleAction(formData: FormData) {
    "use server";
    await updateSiteSettings(formData);
    redirect("/admin/settings");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">全站設定</h1>
      <form action={handleAction} className="max-w-2xl space-y-4 bg-white p-6 rounded-lg border">
        <FormField label="會址" name="address" defaultValue={settings?.address} required />
        <FormField label="電話" name="tel" defaultValue={settings?.tel} required />
        <FormField label="傳真" name="fax" defaultValue={settings?.fax} required />
        <FormField label="Email" name="email" type="email" defaultValue={settings?.email} required />
        <FormField label="版權文字" name="copyrightText" defaultValue={settings?.copyrightText ?? ""} />
        <SubmitButton />
      </form>
    </div>
  );
}
