import Image from "next/image";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { getBoardMembers } from "@/lib/queries/board-members";
import { getAims, getDirectors, getPurposes } from "@/lib/queries/about";
import { getPageSections } from "@/lib/queries/settings";

export default async function AboutPage() {
  const [boardMembersList, aims, directors, purposes, sections] = await Promise.all([
    getBoardMembers(),
    getAims(),
    getDirectors(),
    getPurposes(),
    getPageSections("about"),
  ]);

  const leadershipQuote = sections.find(s => s.sectionKey === "leadership_quote");
  const directorsPower = sections.find(s => s.sectionKey === "directors_power");

  return (
    <>
      <Header />
      <main className="bg-white">
        <PageTitle />
        <IntroHeader />
        <ValuesSection />
        <AimSection aims={aims} />
        <CharterHeader />
        <DirectorsSection directors={directors} />
        <LeadershipQuote content={leadershipQuote} />
        <AssociationPurpose purposes={purposes} />
        <DirectorsPower content={directorsPower} />
        <BoardMembersSection members={boardMembersList} />
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
          關於本會
        </h2>
        <div className="mt-2 h-[2px] w-[160%] bg-[#1d2087]/40" />
      </div>
    </section>
  );
}

function IntroHeader() {
  return (
    <section className="mx-auto px-6 pb-6 md:px-12 lg:px-24">
      <h2 className="text-3xl font-bold md:font-[900] tracking-[0.2em] text-[#1d2087] lg:text-4xl text-stroke-navy">
        本會簡介
      </h2>
      <div className="mt-2 lg:mt-4 h-[2px] w-1/2 bg-[#1d2087]" />
    </section>
  );
}

function ValuesSection() {
  return (
    <section className="mx-auto px-6 pb-8 md:px-12 lg:px-24">
      <h3 className="text-2xl font-bold text-[#1d2087] lg:text-2xl">Our Values for TISCLLB</h3>
      <h4 className="mb-8 font-bold text-xl text-[#1d2087] md:text-2xl">台灣臨床下肢生物力學國際學會的價值</h4>
      <div className="flex justify-center py-4">
        <Image src="/TISCLLB-web_關於本會＿學會價值 (1).jpg" alt="Our Values" width={800} height={480} className="w-full max-w-2xl" />
      </div>
    </section>
  );
}

function AimSection({ aims }: { aims: { id: string; contentEn: string; contentCn: string }[] }) {
  return (
    <section className="mx-auto px-6 py-8 md:px-12 lg:px-24">
      <h3 className="text-2xl font-bold text-[#1d2087] lg:text-2xl">Our Aim</h3>
      <h4 className="mb-6 font-bold text-xl text-[#1d2087] md:text-2xl">我們的目標</h4>
      <div className="space-y-5">
        {aims.map((aim) => (
          <AimBullet key={aim.id} en={aim.contentEn} zh={aim.contentCn} />
        ))}
      </div>
      <div className="mt-10 flex justify-center">
        <Image src="/TISCLLB-web_關於本會＿我們的目標.jpg" alt="IACB 國際網絡" width={900} height={900} className="w-full max-w-3xl" />
      </div>
    </section>
  );
}

function AimBullet({ en, zh }: { en: string; zh: string }) {
  return (
    <div>
      <p className="text-sm leading-relaxed text-foreground lg:text-base">
        <span className="mr-1 inline-block text-lg text-[#1d2087]">▶</span>{en}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-text-gray lg:text-base">{zh}</p>
    </div>
  );
}

function CharterHeader() {
  return (
    <section className="mx-auto px-6 pt-16 pb-6 md:px-12 lg:px-24">
      <h2 className="text-3xl font-bold md:font-[900] tracking-[0.2em] text-[#1d2087] lg:text-4xl text-stroke-navy">
        本會章程
      </h2>
      <div className="mt-2 lg:mt-4 h-[2px] w-1/2 bg-[#1d2087]" />
    </section>
  );
}

function DirectorsSection({ directors }: { directors: { id: string; contentEn: string; contentCn: string }[] }) {
  return (
    <section className="mx-auto px-6 pb-8 md:px-12 lg:px-24">
      <h3 className="text-2xl font-bold text-[#1d2087] lg:text-2xl">Why Have TISCLLB DIRECTORS?</h3>
      <h4 className="mb-6 font-bold text-xl text-[#1d2087] md:text-2xl">為什麼要設置TISCLLB理事？</h4>
      <div className="space-y-4">
        {directors.map((d) => (
          <DirectorBullet key={d.id} en={d.contentEn} zh={d.contentCn} />
        ))}
      </div>
    </section>
  );
}

function DirectorBullet({ en, zh }: { en: string; zh: string }) {
  return (
    <div>
      <p className="text-sm text-foreground lg:text-base">
        <span className="mr-1 inline-block text-lg text-[#1d2087]">▶</span>{en}
      </p>
      <p className="mt-0.5 text-sm text-text-gray">{zh}</p>
    </div>
  );
}

function LeadershipQuote({ content }: { content: { contentEn: string | null; contentCn: string | null } | undefined }) {
  const enText = content?.contentEn || "For most practitioners, creating professional LEADERSHIP is important";
  const cnText = content?.contentCn || "對於大多數從業者來說 建立專業的領導力很重要";

  const renderEnglish = (text: string) => {
    const parts = text.split(/(LEADERSHIP)/);
    return parts.map((part, i) =>
      part === "LEADERSHIP" ? (
        <span key={i} className="relative inline-block">
          {part}
          <span className="absolute bottom-[-2px] left-[-8px] right-[-8px] h-[5px] bg-[#ff8f1e]" />
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  const renderChinese = (text: string) => {
    const parts = text.split(/(專業的領導力)/);
    return parts.map((part, i) =>
      part === "專業的領導力" ? (
        <span key={i} className="relative inline-block">
          {part}
          <span className="absolute bottom-[-2px] left-[-8px] right-[-8px] h-[5px] bg-[#ff8f1e]" />
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <section className="mx-auto px-6 pb-12 md:px-12 lg:px-16 bg-bg-block">
      <div className="relative  py-10  ">
        <div className="max-w-xl me-auto">
          <span className="absolute left-[-40px] top-[40px] text-4xl leading-none text-[#1d2087] md:left-[-80px] md:top-[30px] md:text-6xl lg:left-[-100px] lg:top-[30px] ">
            ▶
          </span>
          <h2 className="text-2xl font-bold md:font-black italic leading-snug text-[#1d2087] lg:text-3xl xl:text-4xl">
            {renderEnglish(enText)}
          </h2>
          <p className="mt-4 text-xl font-bold text-[#1d2087] lg:text-2xl leading-relaxed">
            {renderChinese(cnText)}
          </p>
        </div>
      </div>
    </section>
  );
}

function AssociationPurpose({ purposes }: { purposes: { id: string; contentEn: string; contentCn: string }[] }) {
  return (
    <section className="mx-auto px-6 pb-8 md:px-12 lg:px-24">
      <h3 className="text-2xl font-bold text-[#1d2087] lg:text-2xl">What is the association for?</h3>
      <h4 className="mb-6 font-bold text-xl text-[#1d2087] md:text-2xl">學會的目的是什麼？</h4>
      <div className="space-y-5">
        {purposes.map((p) => (
          <AimBullet key={p.id} en={p.contentEn} zh={p.contentCn} />
        ))}
      </div>
    </section>
  );
}

function DirectorsPower({ content }: { content: { contentEn: string | null; contentCn: string | null } | undefined }) {
  return (
    <section className="mx-auto px-6 pb-12 md:px-12 lg:px-24">
      <div className="text-center">
        <h2 className="text-2xl font-bold md:font-black italic text-[#ff8f1e] md:text-3xl lg:text-5xl xl:text-6xl">
          Directors ARE POWER to shape this<br />association
        </h2>
        <p className="mt-4 text-xl font-bold md:font-black text-[#ff8f1e] md:text-2xl lg:text-4xl">
          理監事們是塑造這個學會的力量
        </p>
      </div>
      <div className="mt-8 space-y-4">
        <p className="text-sm leading-relaxed text-foreground lg:text-base">
          {content?.contentEn || "I believe not only placing TISCLLB Directorship after your title is impressive, but providing you with the recognition by your colleagues and your patient that you a specialist in this field."}
        </p>
        <p className="text-sm leading-relaxed text-foreground lg:text-base">
          {content?.contentCn || "我認為在你的頭銜後面加上TISCLLB的理監事頭銜不僅令人印象深刻，而且還讓你的同事和患者認可你是該領域的專家。"}
        </p>
      </div>
    </section>
  );
}

function BoardMembersSection({ members }: { members: { id: string; nameEn: string; titleEn: string; titleCn: string; image: string | null }[] }) {
  return (
    <section className="mx-auto px-6 pb-12 md:px-12 lg:px-24">
      <h2 className="text-3xl font-bold md:font-[900] tracking-[0.2em] text-[#1d2087] lg:text-4xl text-stroke-navy">
        組織成員
      </h2>
      <div className="mt-3 mb-8 h-[2px] w-1/3 bg-[#1d2087]" />
      <div className="mb-8">
        <p className="font-bold md:font-black text-[#1d2087] text-xl md:text-2xl">第一屆</p>
        <p className="font-bold md:font-black text-[#1d2087] text-xl md:text-2xl">台灣臨床下肢生物力學國際學會</p>
        <p className="font-bold md:font-black text-[#1d2087] text-xl md:text-2xl">理監事</p>
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 md:gap-6">
        {members.map((m) => (
          <MemberCard key={m.id} name={m.nameEn} titleEn={m.titleEn} titleCn={m.titleCn} image={m.image || "/組織成員/TISCLLB web-01.jpg"} />
        ))}
      </div>
    </section>
  );
}

function MemberCard({ name, titleCn, titleEn, image }: { name: string; titleCn: string; titleEn: string; image: string }) {
  return (
    <div className="overflow-hidden rounded-2xl">
      <div className="relative aspect-square">
        <Image src={image} alt={name} fill className="object-cover" sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw" />
      </div>
      <div className="bg-[#d1f0f4] px-3 py-3 md:px-4 md:py-4">
        <p className="text-sm font-bold text-[#1d2087] md:text-base">{name}</p>
        <p className="text-xs text-[#1d2087] md:text-sm">{titleEn}</p>
        <p className="text-xs text-[#1d2087] md:text-sm">{titleCn}</p>
      </div>
    </div>
  );
}
