"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/hero", label: "首頁 Hero", icon: "🏠" },
  { href: "/admin/philosophy", label: "倡導理念", icon: "💡" },
  { href: "/admin/events", label: "活動管理", icon: "📅" },
  { href: "/admin/gallery", label: "活動錦集", icon: "🖼️" },
  { href: "/admin/board-members", label: "組織成員", icon: "👥" },
  { href: "/admin/members", label: "會員名單", icon: "📋" },
  { href: "/admin/about", label: "關於本會", icon: "ℹ️" },
  { href: "/admin/recruit", label: "招募會員", icon: "📢" },
  { href: "/admin/blog", label: "Blog 管理", icon: "✏️" },
  { href: "/admin/settings", label: "全站設定", icon: "⚙️" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 min-h-screen bg-[#1d2087] text-white flex flex-col">
      <div className="p-4 border-b border-white/20">
        <Link href="/admin" className="text-lg font-bold">
          TISCLLB 後台
        </Link>
      </div>
      <nav className="flex-1 py-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-white/20 font-medium"
                  : "hover:bg-white/10"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/20">
        <Link href="/" className="text-sm text-white/70 hover:text-white">
          ← 返回前台
        </Link>
      </div>
    </aside>
  );
}
