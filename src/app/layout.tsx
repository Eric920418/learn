import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TISCLLB 台灣臨床下肢生物力學國際學會",
  description:
    "台灣臨床下肢生物力學國際學會 TAIWAN INTERNATIONAL SOCIETY OF CLINICAL LOWER LIMB BIOMECHANICS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <body
        className={`${notoSansTC.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
