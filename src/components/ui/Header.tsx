"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "關於本會", href: "/about" },
  { label: "倡導理念", href: "/#philosophy" },
  { label: "活動訊息", href: "/events" },
  { label: "本會會員", href: "/members" },
  { label: "招募會員", href: "/recruit" },
  { label: "聯絡我們", href: "/contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* 頂部漸層細線 */}
      <div className="h-1 bg-gradient-to-r from-primary-blue to-accent-teal" />

      <div className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo + 文字 */}
          <Link href="/" className="flex items-center gap-3">
            <LogoIcon />
            <div className="leading-tight">
              <p className="text-sm font-bold text-primary-navy">
                台灣臨床下肢生物力學國際學會
              </p>
              <p className="hidden text-[10px] tracking-wide text-text-gray sm:block">
                TAIWAN INTERNATIONAL SOCIETY OF CLINICAL
                <br />
                LOWER LIMB BIOMECHANICS
              </p>
            </div>
          </Link>

          {/* 桌面版導覽 */}
          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-text-gray transition-colors hover:text-primary-navy"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* 手機版漢堡按鈕 */}
          <button
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="開啟選單"
          >
            <svg
              className="h-6 w-6 text-primary-navy"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* 手機版選單 */}
        {mobileMenuOpen && (
          <nav className="border-t border-gray-100 bg-white px-6 py-4 lg:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-sm text-text-gray transition-colors hover:text-primary-navy"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}

function LogoIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <circle cx="20" cy="20" r="19" stroke="#0d2e4d" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="15" stroke="#2aaa8a" strokeWidth="1" />
      {/* 簡化的腿骨圖示 */}
      <path
        d="M17 8 C17 8, 16 14, 17 18 C18 22, 16 26, 15 32"
        stroke="#0d2e4d"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M23 8 C23 8, 24 14, 23 18 C22 22, 24 26, 25 32"
        stroke="#0d2e4d"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* 膝蓋關節 */}
      <ellipse cx="20" cy="18" rx="4" ry="2.5" stroke="#2aaa8a" strokeWidth="1" fill="none" />
    </svg>
  );
}
