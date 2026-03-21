import Link from "next/link";

const sections = [
  { href: "/admin/hero", label: "首頁 Hero", desc: "編輯首頁主視覺文字與圖片" },
  { href: "/admin/philosophy", label: "倡導理念", desc: "管理目標與願景條目" },
  { href: "/admin/events", label: "活動管理", desc: "新增、編輯、刪除活動" },
  { href: "/admin/board-members", label: "組織成員", desc: "管理理監事名單與照片" },
  { href: "/admin/members", label: "會員名單", desc: "管理會員資料" },
  { href: "/admin/about", label: "關於本會", desc: "編輯目標、理事、學會目的" },
  { href: "/admin/recruit", label: "招募會員", desc: "編輯招募頁面內容" },
  { href: "/admin/blog", label: "Blog 管理", desc: "發布與編輯文章" },
  { href: "/admin/settings", label: "全站設定", desc: "聯絡資訊、版權文字" },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="block p-5 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <h2 className="font-semibold text-lg mb-1">{s.label}</h2>
            <p className="text-sm text-gray-500">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
