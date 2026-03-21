"use server";

import { auth } from "@/auth";

export async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    throw new Error("未授權：需要管理員權限");
  }
  return session;
}
