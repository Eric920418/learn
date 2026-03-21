"use client";

import { signOut, useSession } from "next-auth/react";

export function AdminHeader() {
  const { data: session } = useSession();

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {session?.user?.email}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="text-sm text-red-600 hover:text-red-800"
        >
          登出
        </button>
      </div>
    </header>
  );
}
