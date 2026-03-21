import Link from "next/link";
import { getBoardMembers } from "@/lib/queries/board-members";
import { BoardMemberList } from "./board-member-list";

export default async function BoardMembersAdminPage() {
  const members = await getBoardMembers();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">組織成員</h1>
        <Link
          href="/admin/board-members/new"
          className="px-4 py-2 text-sm text-white rounded-md"
          style={{ backgroundColor: "var(--primary-navy)" }}
        >
          新增成員
        </Link>
      </div>
      <BoardMemberList members={members} />
    </div>
  );
}
