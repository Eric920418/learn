import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // 已登入 → 直接導向後台
  if (session) {
    redirect("/admin");
  }

  return <>{children}</>;
}
