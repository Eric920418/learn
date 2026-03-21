import Image from "next/image";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import EventCard from "@/components/ui/EventCard";
import { getHeroContent } from "@/lib/queries/hero";
import { getPhilosophyItems } from "@/lib/queries/philosophy";
import { getPublishedEvents } from "@/lib/queries/events";

export default async function Home() {
  const [hero, philosophyItems, events] = await Promise.all([
    getHeroContent(),
    getPhilosophyItems(),
    getPublishedEvents(),
  ]);

  const goals = philosophyItems.filter((i) => i.category === "goal");
  const visions = philosophyItems.filter((i) => i.category === "vision");

  return (
    <>
      <Header />
      <main>
        <HeroSection hero={hero} />
        <PhilosophySection goals={goals} visions={visions} />
        <EventsSection events={events} />
      </main>
      <Footer />
    </>
  );
}

/* --- Hero Section --- */
function HeroSection({ hero }: { hero: { titleLine1: string; titleLine2: string; subtitleCn: string; subtitleEn: string; announcementText: string | null; heroImage: string | null; } | null }) {
  const titleLine1 = hero?.titleLine1 ?? "歡 迎 加 入";
  const titleLine2 = hero?.titleLine2 ?? "TISCLLB";
  const subtitleCn = hero?.subtitleCn ?? "台灣臨床下肢生物力學\n國際學會";
  const subtitleEn = hero?.subtitleEn ?? "TAIWAN INTERNATIONAL SOCIETY OF  CLINICAL\nLOWER LIMB BIOMECHANICS";
  const announcement = hero?.announcementText ?? "2026正式啟動";
  const heroImage = hero?.heroImage ?? "/TISCLLB-web_首頁＿首圖.jpg";

  return (
    <section className="relative min-h-[calc(100vh-65px)] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt="下肢生物力學"
          fill
          className="object-contain object-right-top scale-100 origin-top-right"
          priority
        />
      </div>

      <div className="relative z-10 flex min-h-[calc(100vh-65px)] flex-col justify-center px-6 pb-12 md:px-12 md:pb-16 lg:px-16 xl:px-24">
        <h2 className="mb-2 text-2xl font-black tracking-[0.2em] text-[#1d2087] md:text-4xl lg:text-5xl xl:text-6xl">
          {titleLine1}
        </h2>
        <h1 className="mb-2 text-4xl font-black tracking-[0.12em] text-[#1d2087] md:text-6xl lg:text-8xl xl:text-9xl">
          {titleLine2}
        </h1>
        <div className="mb-5 h-1 w-40 bg-[#1d2087] md:w-56 lg:w-100" />
        <h2
          className="text-2xl font-black leading-snug text-[#1d2087] md:text-3xl lg:text-4xl xl:text-5xl"
          style={{ WebkitTextStroke: "1px #1d2087" }}
        >
          {subtitleCn.split("\n").map((line, i) => (
            <span key={i}>{line}{i < subtitleCn.split("\n").length - 1 && <br />}</span>
          ))}
        </h2>
        <p className="mt-5 text-sm leading-relaxed tracking-[0.15em] text-[#1d2087]/70 md:text-base lg:text-lg whitespace-pre-line">
          {subtitleEn}
        </p>
        {announcement && (
          <div className="mt-[20px] text-2xl font-black leading-snug tracking-[0.2em] text-[#256f91] md:text-3xl lg:text-4xl xl:text-5xl" style={{ WebkitTextStroke: "1px #256f91" }}>
            {announcement}
          </div>
        )}
      </div>
    </section>
  );
}

/* --- Philosophy Section --- */
function PhilosophySection({ goals, visions }: { goals: { id: string; contentEn: string; contentCn: string }[]; visions: { id: string; contentEn: string; contentCn: string }[] }) {
  return (
    <section id="philosophy" className="relative overflow-hidden bg-white py-12 md:py-16 lg:py-24">
      <div className="pointer-events-none absolute left-[20%] top-[-60%] h-[200%] w-[40%] rotate-[80deg] bg-[#d1f0f4]/20" />
      <div className="relative mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        <div className="mb-12">
          <h2
            className="text-right text-3xl font-[900] tracking-[0.2em] text-[#1d2087] lg:text-4xl xl:text-5xl"
            style={{ WebkitTextStroke: "1px #1d2087" }}
          >
            倡 導 理 念
          </h2>
          <div className="mt-4 ml-auto h-[2px] w-1/2 bg-[#1d2087]" />
        </div>

        <div className="pl-6 lg:pl-10">
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
  );
}

/* --- Events Section --- */
function EventsSection({ events }: { events: { id: string; date: string; titleCn: string; titleEn: string; speaker: string; speakerTitle: string; location: string }[] }) {
  return (
    <section id="events" className="bg-white py-12 md:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        <div className="mb-12">
          <h2
            className="text-3xl font-[900] tracking-[0.2em] text-[#1d2087] lg:text-4xl xl:text-5xl"
            style={{ WebkitTextStroke: "1px #1d2087" }}
          >
            活動訊息
          </h2>
          <div className="mt-4 h-[2px] w-1/2 bg-[#1d2087]" />
        </div>

        <div className="flex justify-center">
          <EventCard events={events} />
        </div>
      </div>
    </section>
  );
}

function BulletPoint({ en, zh }: { en: string; zh: string }) {
  return (
    <div>
      <p className="text-sm font-semibold leading-relaxed text-foreground lg:text-base">
        <span className="mr-1 inline-block text-lg text-[#1d2087]">▶</span>
        {en}
      </p>
      <p className="mt-1 text-sm font-bold leading-relaxed text-foreground lg:text-base">
        {zh}
      </p>
    </div>
  );
}
