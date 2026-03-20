import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

export default function PhilosophyPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        {/* 頁面大標題 */}
        <section className="pb-20 pt-20 text-center md:pb-28 md:pt-28 lg:pb-32 lg:pt-32 xl:pb-40 xl:pt-40">
          <h1 className="text-3xl font-black tracking-[0.15em] text-primary-navy md:text-5xl lg:text-7xl xl:text-8xl">
            TISCLLB
          </h1>
          <div className="mx-auto mt-4 flex items-center justify-center gap-4">
            <div className="h-[1px] w-10 bg-primary-navy/40 md:w-16 lg:w-24" />
            <h2 className="text-lg font-bold tracking-[0.15em] text-primary-navy md:text-xl lg:text-2xl">
              倡導理念
            </h2>
            <div className="h-[1px] w-10 bg-primary-navy/40 md:w-16 lg:w-24" />
          </div>
        </section>

        {/* 倡導理念內容 — 與首頁一致 */}
        <section className="bg-white pb-16 md:pb-20 lg:pb-28">
          <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
            {/* 標題 — 右對齊 + 下方水平線 */}
            <div className="mb-12">
              <h2 className="text-right text-3xl font-bold tracking-[0.2em] text-primary-navy lg:text-4xl">
                倡 導 理 念
              </h2>
              <div className="mt-4 ml-auto h-[1px] w-1/2 bg-primary-navy/30" />
            </div>

            {/* 內容區 — 左側垂直邊框線 */}
            <div className=" pl-6 lg:pl-10">
              {/* 目標 */}
              <div className="mb-14">
                <h3 className="mb-6 text-xl font-bold tracking-[0.2em] text-[#d4870e] lg:text-2xl">
                  目 標
                </h3>
                <div className="space-y-8">
                  <BulletPoint
                    en="To help infrastructure decision-makers understand and accept what is clinical biomechanics and how this field assists in improving the well-being of patients using conservative treatments and reducing patients pain without the use of invasive surgical treatments."
                    zh="幫助基礎入門決策者理解和接受什麼是臨床生物力學，以及該領域如何幫助使用保守治療改善患者的健康狀況，並在不使用侵入性手術治療的情況下減輕患者的痛苦。"
                  />
                  <BulletPoint
                    en="To create a better educated public on clinical biomechanics and provide acceptance by law makers on the necessity of the profession in the medical field."
                    zh="使公眾在臨床生物力學方面受到更好的教育，並讓立法者接受醫學領域專業的必要性。"
                  />
                </div>
              </div>

              {/* 願景 */}
              <div>
                <h3 className="mb-6 text-xl font-bold tracking-[0.2em] text-[#d4870e] lg:text-2xl">
                  願 景
                </h3>
                <div className="space-y-8">
                  <BulletPoint
                    en="Our Goal is initial to grow each country nationally and be part of an international same mined professionals."
                    zh="我們的目標是首先在每個國家發展，並成為國際相同挖掘專業人士的一部分。"
                  />
                  <BulletPoint
                    en="Member retention is just as important as recruitment. For us, that means adding distinct member value through continuing education, advanced job opportunities, networking practice groups, scholarship and grant opportunities, and student loan financing."
                    zh="會員保留與招募同樣重要。對我們來說，這意味著通過繼續教育、高級工作機會、網絡實踐小組、獎學金和助學金機會以及學生貸款融資來增加獨特的會員價值。"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function BulletPoint({ en, zh }: { en: string; zh: string }) {
  return (
    <div>
      <div className="flex gap-1.5">
        <span className="mt-0.5 shrink-0 text-[#1a1464]">▶</span>
        <p className="text-sm leading-relaxed text-foreground lg:text-base">
          {en}
        </p>
      </div>
      <p className="mt-2 text-base font-bold leading-relaxed text-[#1a1464]/85 lg:text-lg">
        {zh}
      </p>
    </div>
  );
}
