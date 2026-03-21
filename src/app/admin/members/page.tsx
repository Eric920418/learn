import Link from "next/link";
import { getAssociationMembers } from "@/lib/queries/members";
import { MemberListClient } from "./member-list";

export default async function MembersAdminPage() {
  const members = await getAssociationMembers();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">會員名單</h1>
        <Link
          href="/admin/members/new"
          className="px-4 py-2 text-sm text-white rounded-md"
          style={{ backgroundColor: "var(--primary-navy)" }}
        >
          新增會員
        </Link>
      </div>
      <MemberListClient members={members} />
    </div>
  );
}
