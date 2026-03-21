import { redirect } from "next/navigation";
import { getHeroContent } from "@/lib/queries/hero";
import { updateHero } from "@/lib/actions/hero";
import { FormField } from "@/components/admin/FormField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { SubmitButton } from "@/components/admin/SubmitButton";

export default async function HeroAdminPage() {
  const hero = await getHeroContent();

  async function handleAction(formData: FormData) {
    "use server";
    await updateHero(formData);
    redirect("/admin/hero");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">首頁 Hero</h1>
      <form action={handleAction} className="max-w-2xl space-y-4 bg-white p-6 rounded-lg border">
        <FormField label="標題第一行" name="titleLine1" defaultValue={hero?.titleLine1 ?? "歡 迎 加 入"} required />
        <FormField label="標題第二行" name="titleLine2" defaultValue={hero?.titleLine2 ?? "TISCLLB"} required />
        <FormField label="中文副標" name="subtitleCn" type="textarea" defaultValue={hero?.subtitleCn ?? ""} required />
        <FormField label="英文副標" name="subtitleEn" type="textarea" defaultValue={hero?.subtitleEn ?? ""} required />
        <FormField label="公告文字" name="announcementText" defaultValue={hero?.announcementText ?? ""} />
        <ImageUpload name="heroImage" currentImage={hero?.heroImage} label="背景圖片" />
        <SubmitButton />
      </form>
    </div>
  );
}
