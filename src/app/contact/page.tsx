import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        {/* 頁面大標題 */}
        <section className="pb-20 pt-20 text-center md:pb-28 md:pt-28 lg:pb-32 lg:pt-32 xl:pb-40 xl:pt-40">
          <h1 className="text-4xl font-black tracking-[0.15em] text-[#1a1464] md:text-6xl lg:text-8xl xl:text-9xl">
            TISCLLB
          </h1>
          <div className="mx-auto mt-4 inline-flex flex-col items-center">
            <h2 className="text-2xl font-bold tracking-[0.15em] text-[#1a1464] lg:text-3xl">
              聯 絡 我 們
            </h2>
            <div className="mt-2 h-[2px] w-[160%] bg-[#1a1464]/40" />
          </div>
        </section>

        {/* 歡迎文字 */}
        <section className="mx-auto max-w-4xl px-6 pb-12 pt-8 md:px-12 md:pb-16 lg:px-16 lg:pb-24">
          <p className="text-base font-bold text-foreground md:text-lg">
            感謝您造訪TISCLLB的網站。
          </p>
          <p className="mt-6 text-base font-bold leading-relaxed text-foreground md:text-lg">
            歡迎您提供寶貴的意見，若想尋求合作或有其他需求
            <br />
            請聯繫我們，謝謝！
          </p>
        </section>

        {/* 聯絡資訊區塊 — 淡青綠色背景 */}
        <section className="bg-[#eef7f4] py-16 lg:py-20">
          <div className="mx-auto max-w-4xl px-6 md:px-12 lg:px-16">
            <h3
              className="mb-8 flex items-baseline gap-4 text-2xl font-[900] tracking-[0.1em] text-[#5a7a8a] lg:text-3xl"
              style={{ WebkitTextStroke: "0.5px #5a7a8a" }}
            >
              <span>INFORMATION</span>
              <span className="text-xl lg:text-2xl">聯絡資訊</span>
            </h3>

            <div className="space-y-2 text-base font-medium text-foreground lg:text-lg">
              <p>會址:10487台北市中山區復興北路154號5樓</p>
              <p>Tel:02-2717-0031</p>
              <p>Fax:02-2718-1243</p>
              <p>E-mail: twn.globe@gmail.com</p>
            </div>
          </div>
        </section>

        {/* 底部留白 */}
        <div className="h-16 md:h-24 lg:h-32" />
      </main>
      <Footer />
    </>
  );
}
