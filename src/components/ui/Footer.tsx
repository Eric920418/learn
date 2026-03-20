import Link from "next/link";

const navLinks = [
  { label: "關於本會", href: "/about" },
  { label: "倡導理念", href: "/#philosophy" },
  { label: "活動訊息", href: "/events" },
  { label: "本會會員", href: "/members" },
  { label: "招募會員", href: "/recruit" },
  { label: "聯絡我們", href: "/contact" },
];

export default function Footer() {
  return (
    <footer id="contact">
      {/* 頂部青綠色細線 */}
      <div className="h-0.5 bg-accent-teal" />

      <div className="bg-footer-bg text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 md:flex-row md:items-start md:justify-between">
          {/* 左側：聯絡資訊 */}
          <div className="text-sm leading-relaxed text-white/80">
            <p>會址:10487台北市中山區復興北路154號5樓</p>
            <p>
              Tel:02-2717-0031 &nbsp; Fax:02-2718-1243
            </p>
            <p>E-mail: twn.globe@gmail.com</p>
          </div>

          {/* 右側：導覽 + 版權 */}
          <div className="text-right">
            <nav className="mb-4 flex flex-wrap gap-4 text-sm text-white/80 md:justify-end">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <p className="text-xs text-white/60">
              Copyright © 台灣臨床下肢生物力學國際學會
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
