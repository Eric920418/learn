"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "關於本會", href: "/about" },
  { label: "倡導理念", href: "/#philosophy" },
  { label: "活動訊息", href: "/events" },
  { label: "活動錦集", href: "/gallery" },
  { label: "本會會員", href: "/members" },
  { label: "招募會員", href: "/recruit" },
  { label: "聯絡我們", href: "/contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo + 文字 */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/TISCLLB-web-logo.jpg"
              alt="TISCLLB Logo"
              width={44}
              height={44}
              className="shrink-0 rounded-full"
            />
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

