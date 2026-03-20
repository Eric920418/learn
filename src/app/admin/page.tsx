import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">後台管理</h1>
      <p className="mt-2 text-foreground/60">
        歡迎，{session.user?.name ?? session.user?.email}
      </p>
    </main>
  );
}
