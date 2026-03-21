import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { getPhilosophyItems } from "@/lib/queries/philosophy";

export default async function PhilosophyPage() {
  const items = await getPhilosophyItems();
  const goals = items.filter((i) => i.category === "goal");
  const visions = items.filter((i) => i.category === "vision");

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

        {/* 倡導理念內容 */}
        <section className="bg-white pb-16 md:pb-20 lg:pb-28">
          <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
            <div className="mb-12">
              <h2 className="text-right text-3xl font-bold tracking-[0.2em] text-primary-navy lg:text-4xl">
                倡 導 理 念
              </h2>
              <div className="mt-4 ml-auto h-[1px] w-1/2 bg-primary-navy/30" />
            </div>

            <div className="pl-6 lg:pl-10">
              {/* 目標 */}
              <div className="mb-14">
                <h3 className="mb-6 text-xl font-bold tracking-[0.2em] text-[#256f91] lg:text-2xl">
                  目 標
                </h3>
                <div className="space-y-8">
                  {goals.map((item) => (
                    <BulletPoint key={item.id} en={item.contentEn} zh={item.contentCn} />
                  ))}
                </div>
              </div>

              {/* 願景 */}
              <div>
                <h3 className="mb-6 text-xl font-bold tracking-[0.2em] text-[#256f91] lg:text-2xl">
                  願 景
                </h3>
                <div className="space-y-8">
                  {visions.map((item) => (
                    <BulletPoint key={item.id} en={item.contentEn} zh={item.contentCn} />
                  ))}
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
        <span className="mt-0.5 shrink-0 text-[#1d2087]">▶</span>
        <p className="text-sm leading-relaxed text-foreground lg:text-base">
          {en}
        </p>
      </div>
      <p className="mt-2 text-base font-bold leading-relaxed text-[#1d2087]/85 lg:text-lg">
        {zh}
      </p>
    </div>
  );
}
