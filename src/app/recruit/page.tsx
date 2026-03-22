import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { getFocusItems } from "@/lib/queries/recruit";
import { getPageSections } from "@/lib/queries/settings";

export default async function RecruitPage() {
  const [focusItemsList, sections] = await Promise.all([
    getFocusItems(),
    getPageSections("recruit"),
  ]);

  const seminarsSection = sections.find(s => s.sectionKey === "seminars_text");
  const researchSection = sections.find(s => s.sectionKey === "research_text");

  return (
    <>
      <Header />
      <main className="bg-white">
        <PageTitle />
        <FocusSection items={focusItemsList} />
        <SeminarsSection content={seminarsSection} />
        <ResearchSection content={researchSection} />
      </main>
      <Footer />
    </>
  );
}

function PageTitle() {
  return (
    <section className="pb-12 pt-12 text-center md:pb-28 md:pt-28 lg:pb-32 lg:pt-32 xl:pb-40 xl:pt-40">
      <h1 className="text-4xl font-bold md:font-black tracking-[0.15em] text-[#1d2087] md:text-6xl lg:text-8xl xl:text-9xl">
        TISCLLB
      </h1>
      <div className="mx-auto mt-4 inline-flex flex-col items-center">
        <h2 className="text-2xl font-bold tracking-[0.15em] text-[#1d2087] lg:text-3xl">
          招募會員
        </h2>
        <div className="mt-2 h-[2px] w-[160%] bg-[#1d2087]/40" />
      </div>
    </section>
  );
}

function FocusSection({ items }: { items: { id: string; titleEn: string; titleCn: string; descEn: string; descCn: string; subItems: string | null; sortOrder: number }[] }) {
  return (
    <section className="mx-auto px-6 pb-16 md:px-12 lg:px-24">
      <div className="mb-10">
        <h2 className="text-2xl font-bold md:font-[900] tracking-[0.05em] text-[#1d2087] lg:text-3xl text-stroke-navy-light">
          TISCLLB will be focused on
        </h2>
        <h3 className="mt-1 text-xl font-bold md:font-[900] tracking-[0.1em] text-[#1d2087] lg:text-2xl text-stroke-navy-light">
          我們專注於
        </h3>
      </div>

      <div className="space-y-6">
        {items.map((item) => {
          const subItemsList = item.subItems ? JSON.parse(item.subItems) as string[] : null;

          if (subItemsList && subItemsList.length > 0) {
            return (
              <div key={item.id} className="border-l-[10px] border-[#d1f0f4] pl-5">
                <div className="mb-3 flex flex-wrap items-center gap-2 md:gap-3">
                  <h4 className="text-xl font-bold text-[#256f91] lg:text-2xl">{item.titleEn}</h4>
                  <span className="text-xl font-bold text-[#256f91] lg:text-2xl">{item.titleCn}</span>
                  <div className="ml-2 flex-1 border-t border-[#256f91]" />
                  <span className="text-[#256f91]">→</span>
                </div>
                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3 md:gap-0 md:divide-x md:divide-gray-300">
                  {subItemsList.map((sub, i) => (
                    <div key={i} className={i === 0 ? "md:pr-4" : i === subItemsList.length - 1 ? "md:pl-4" : "md:px-4"}>
                      <p className="font-bold text-black">{sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <div key={item.id} className="border-l-[10px] border-[#d1f0f4] pl-5">
              <div className="mb-1 flex flex-wrap items-center gap-2 md:gap-3">
                <h4 className="text-xl font-bold text-[#256f91] lg:text-2xl">{item.titleEn}</h4>
                <span className="text-xl font-bold text-[#256f91] lg:text-2xl">{item.titleCn}</span>
                <div className="ml-2 flex-1 border-t border-[#256f91]" />
                <span className="text-[#256f91]">→</span>
              </div>
              <p className="text-sm font-bold text-black">{item.descEn}</p>
              <p className="text-sm font-bold text-black">{item.descCn}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SeminarsSection({ content }: { content: { contentEn: string | null; contentCn: string | null } | undefined }) {
  const textEn1 = content?.contentEn?.split("|||")[0] ?? "Continual education is important in professional growth and our website will inform our members of all the courses available.";
  const textCn1 = content?.contentCn?.split("|||")[0] ?? "繼續教育在專業成長中很重要，我們會於網站告知我會員所有可用的課程。";
  const textEn2 = content?.contentEn?.split("|||")[1] ?? "This also gives our members opportunity to advertise and pass knowledge to other members. The courses will need to relate to clinical biomechanical training.";
  const textCn2 = content?.contentCn?.split("|||")[1] ?? "這也為我們的會員提供了宣傳和向會員傳遞知識的機會。這些課程需要與臨床生物力學訓練相關。";

  return (
    <section className="mx-auto px-6 py-12 md:px-12 md:py-16 lg:px-24">
      <div className="mb-10">
        <h2 className="text-2xl font-bold md:font-[900] tracking-[0.05em] text-[#1d2087] lg:text-3xl text-stroke-navy-light">
          Seminars and Continuing Education
        </h2>
        <h3 className="mt-1 text-xl font-bold md:font-[900] tracking-[0.1em] text-[#1d2087] lg:text-2xl text-stroke-navy-light">
          研討會及繼續教育
        </h3>
      </div>

      <div className="-mx-6 mb-12 grid grid-cols-1 gap-3 md:-mx-12 md:grid-cols-3 lg:-mx-24">
        <ImagePlaceholder />
        <ImagePlaceholder />
        <div className="p-6 lg:p-8">
          <p className="text-sm leading-relaxed text-foreground">
            <span className="mr-1 inline-block text-lg text-[#1d2087]">▶</span>
            {textEn1}
          </p>
          <p className="mt-3 text-sm font-bold leading-relaxed text-foreground">{textCn1}</p>
        </div>
      </div>

      <div className="-mx-6 grid grid-cols-1 gap-3 md:-mx-12 md:grid-cols-3 lg:-mx-24">
        <div className="p-6 lg:p-8">
          <p className="text-sm leading-relaxed text-foreground">
            <span className="mr-1 inline-block text-lg text-[#1d2087]">▶</span>
            {textEn2}
          </p>
          <p className="mt-3 text-sm font-bold leading-relaxed text-foreground">{textCn2}</p>
        </div>
        <ImagePlaceholder />
        <ImagePlaceholder />
      </div>
    </section>
  );
}

function ImagePlaceholder() {
  return (
    <div className="flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#d1f0f4] to-[#d1f0f4] aspect-[4/3]">
      <svg className="h-10 w-10 text-primary-navy/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    </div>
  );
}

function ResearchSection({ content }: { content: { contentEn: string | null; contentCn: string | null } | undefined }) {
  return (
    <section className="mx-auto px-6 py-12 md:px-12 md:py-16 lg:px-24">
      <div className="mb-6">
        <h2 className="text-2xl font-bold md:font-[900] tracking-[0.05em] text-[#1d2087] lg:text-3xl text-stroke-navy-light">
          Research and Development
        </h2>
        <h3 className="mt-1 text-xl font-bold md:font-[900] tracking-[0.1em] text-[#1d2087] lg:text-2xl text-stroke-navy-light">
          研究與發展
        </h3>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-foreground">
        {content?.contentEn ?? "In future grants will be provided to students and researches willing to undertake studies in the field of clinical biomechanics and related areas. To assist and benefit the growth of the profession."}
      </p>
      <p className="text-sm leading-relaxed text-foreground">
        {content?.contentCn ?? "在未來，將向願意在臨床生物力學和相關領域進行研究的學生和研究人員提供資助，協助及促進本專業的發展。"}
      </p>
    </section>
  );
}
