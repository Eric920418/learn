"use client";

import Link from "next/link";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteBoardMember } from "@/lib/actions/board-members";

interface BoardMember {
  id: string;
  nameEn: string;
  titleCn: string;
  titleEn: string;
  sortOrder: number;
}

export function BoardMemberList({ members }: { members: BoardMember[] }) {
  return (
    <div className="space-y-3">
      {members.map((m) => (
        <div key={m.id} className="bg-white p-4 rounded-lg border flex items-center justify-between">
          <div>
            <p className="font-medium">{m.nameEn}</p>
            <p className="text-sm text-gray-500">{m.titleEn} / {m.titleCn}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/admin/board-members/${m.id}`} className="px-3 py-1 text-xs text-blue-600 border border-blue-300 rounded hover:bg-blue-50">
              編輯
            </Link>
            <DeleteButton onDelete={() => deleteBoardMember(m.id)} itemName="此成員" />
          </div>
        </div>
      ))}
      {members.length === 0 && <p className="text-gray-500 text-sm">尚無組織成員</p>}
    </div>
  );
}
