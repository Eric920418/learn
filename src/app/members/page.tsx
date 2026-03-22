import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { getAssociationMembersPaginated } from "@/lib/queries/members";
import Link from "next/link";

const PAGE_SIZE = 20;

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageStr } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageStr || "1", 10) || 1);
  const { data: members, total, totalPages } = await getAssociationMembersPaginated(currentPage, PAGE_SIZE);

  return (
    <>
      <Header />
      <main className="bg-white">
        {/* 頁面大標題 */}
        <section className="pb-12 pt-12 text-center md:pb-28 md:pt-28 lg:pb-32 lg:pt-32 xl:pb-40 xl:pt-40">
          <h1 className="text-4xl font-bold md:font-black tracking-[0.15em] text-[#1d2087] md:text-6xl lg:text-8xl xl:text-9xl">
            TISCLLB
          </h1>
          <div className="mx-auto mt-4 inline-flex flex-col items-center">
            <h2 className="text-2xl font-bold tracking-[0.15em] text-[#1d2087] lg:text-3xl">
              會員名單
            </h2>
            <div className="mt-2 h-[2px] w-[160%] bg-[#1d2087]/40" />
          </div>
        </section>

        {/* 會員列表 */}
        <section className="mx-auto px-6 pb-16 md:px-12 md:pb-20 lg:px-24">
          <div className="flex border-b-2 border-primary-navy/20 pb-3 text-xs font-bold text-primary-navy md:text-sm">
            <div className="w-8 shrink-0 md:w-10" />
            <div className="flex-1">姓名</div>
            <div className="flex-1 text-right lg:text-left">工作單位 / E-mail</div>
          </div>

          {members.map((m, i) => (
            <div key={m.id} className="flex border-b border-gray-200 py-3 text-sm md:py-4">
              <div className="w-8 shrink-0 flex items-center justify-center text-sm font-bold text-primary-navy md:w-10 md:ms-[-10px] md:text-lg">
                {(currentPage - 1) * PAGE_SIZE + i + 1}
              </div>
              <div className="flex-1">
                <p className="font-black text-sm text-[#1d2087] md:text-base lg:text-lg">{m.nameCn}</p>
                <p className="text-xs text-[#1d2087] md:text-sm lg:text-lg">{m.nameEn}</p>
              </div>
              <div className="flex-1 text-right lg:text-left">
                <p className="text-xs text-[#1d2087] md:text-sm lg:text-lg">{m.workplace}</p>
                <p className="break-all text-xs text-[#1d2087] md:text-sm lg:text-lg">{m.email}</p>
                {m.email2 && (
                  <p className="break-all text-xs text-[#1d2087] md:text-sm lg:text-lg">{m.email2}</p>
                )}
              </div>
            </div>
          ))}

          {members.length === 0 && (
            <p className="py-8 text-center text-gray-500">目前沒有會員資料</p>
          )}

          {/* 換頁器 */}
          {totalPages > 1 && (
            <nav className="mt-8 flex items-center justify-center gap-1 md:gap-2">
              {/* 上一頁 */}
              {currentPage > 1 ? (
                <Link
                  href={`/members?page=${currentPage - 1}`}
                  className="rounded-lg border border-[#1d2087]/30 px-3 py-2 text-sm text-[#1d2087] transition hover:bg-[#1d2087] hover:text-white"
                >
                  ←
                </Link>
              ) : (
                <span className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-300 cursor-not-allowed">
                  ←
                </span>
              )}

              {/* 頁碼 */}
              {generatePageNumbers(currentPage, totalPages).map((p, idx) =>
                p === "..." ? (
                  <span key={`ellipsis-${idx}`} className="px-2 py-2 text-sm text-gray-400">
                    …
                  </span>
                ) : (
                  <Link
                    key={p}
                    href={`/members?page=${p}`}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      p === currentPage
                        ? "border-[#1d2087] bg-[#1d2087] text-white"
                        : "border-[#1d2087]/30 text-[#1d2087] hover:bg-[#1d2087] hover:text-white"
                    }`}
                  >
                    {p}
                  </Link>
                )
              )}

              {/* 下一頁 */}
              {currentPage < totalPages ? (
                <Link
                  href={`/members?page=${currentPage + 1}`}
                  className="rounded-lg border border-[#1d2087]/30 px-3 py-2 text-sm text-[#1d2087] transition hover:bg-[#1d2087] hover:text-white"
                >
                  →
                </Link>
              ) : (
                <span className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-300 cursor-not-allowed">
                  →
                </span>
              )}

              {/* 總筆數 */}
              <span className="ml-4 text-xs text-gray-400">
                共 {total} 筆
              </span>
            </nav>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

/** 生成頁碼列表，當頁數多時顯示省略號 */
function generatePageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  if (current > 3) {
    pages.push("...");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("...");
  }

  pages.push(total);
  return pages;
}
