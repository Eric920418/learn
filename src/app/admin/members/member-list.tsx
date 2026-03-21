"use client";

import Link from "next/link";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteMember } from "@/lib/actions/members";

interface Member {
  id: string;
  nameCn: string;
  nameEn: string;
  workplace: string;
  email: string;
}

export function MemberListClient({ members }: { members: Member[] }) {
  return (
    <div className="space-y-3">
      {members.map((m) => (
        <div key={m.id} className="bg-white p-4 rounded-lg border flex items-center justify-between">
          <div>
            <p className="font-medium">{m.nameCn} ({m.nameEn})</p>
            <p className="text-sm text-gray-500">{m.workplace} | {m.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/admin/members/${m.id}`} className="px-3 py-1 text-xs text-blue-600 border border-blue-300 rounded hover:bg-blue-50">
              編輯
            </Link>
            <DeleteButton onDelete={() => deleteMember(m.id)} itemName="此會員" />
          </div>
        </div>
      ))}
      {members.length === 0 && <p className="text-gray-500 text-sm">尚無會員</p>}
    </div>
  );
}
