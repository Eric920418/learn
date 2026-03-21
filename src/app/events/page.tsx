import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { getPublishedEvents } from "@/lib/queries/events";

export default async function EventsPage() {
  const eventList = await getPublishedEvents();

  return (
    <>
      <Header />
      <main className="bg-white">
        {/* 頁面大標題 */}
        <section className="pb-20 pt-20 text-center md:pb-28 md:pt-28 lg:pb-32 lg:pt-32 xl:pb-40 xl:pt-40">
          <h1 className="text-4xl font-black tracking-[0.15em] text-[#1d2087] md:text-6xl lg:text-8xl xl:text-9xl">
            TISCLLB
          </h1>
          <div className="mx-auto mt-4 inline-flex flex-col items-center">
            <h2 className="text-2xl font-bold tracking-[0.15em] text-[#1d2087] lg:text-3xl">
              活動訊息
            </h2>
            <div className="mt-2 h-[2px] w-[160%] bg-[#1d2087]/40" />
          </div>
        </section>

        {/* 活動列表 */}
        <section className="mx-auto px-6 pb-16 md:px-12 md:pb-20 lg:px-24">
          <div className="space-y-12 md:space-y-16 lg:space-y-20">
            {eventList.map((event) => (
              <EventBlock key={event.id} event={event} />
            ))}
            {eventList.length === 0 && (
              <p className="text-center text-gray-500">目前沒有活動</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function EventBlock({ event }: { event: { sectionTitle: string; date: string; titleCn: string; titleEn: string; speaker: string; speakerTitle: string; location: string; image: string | null; link: string | null; } }) {
  const gradientClass = "from-gradient-start via-primary-blue to-gradient-end";

  const card = (
    <div className="relative w-full max-w-2xl overflow-hidden rounded-lg">
      {event.image ? (
        <div className="relative w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={event.image} alt={event.titleCn} className="w-full h-auto rounded-lg" />
        </div>
      ) : (
        <div className={`bg-gradient-to-br ${gradientClass} px-6 py-20 text-center text-white md:px-8 md:py-28 lg:px-10 lg:py-36`}>
          <div className="pointer-events-none absolute inset-0">
            <svg className="h-full w-full" viewBox="0 0 400 500" fill="none" preserveAspectRatio="none">
              <path d="M0 200 Q200 150, 400 250" stroke="rgba(255,255,255,0.08)" strokeWidth="80" fill="none" />
              <path d="M0 350 Q200 300, 400 400" stroke="rgba(255,255,255,0.05)" strokeWidth="60" fill="none" />
            </svg>
          </div>
          <div className="relative z-10">
            <p className="mb-3 text-xl font-medium">{event.date}</p>
            <h4 className="mb-4 text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
              {event.titleCn}
            </h4>
            <p className="mb-8 whitespace-pre-line text-lg font-medium leading-snug">
              {event.titleEn}
            </p>
            <p className="mb-2 text-base">{event.speaker}</p>
            <p className="mb-2 text-base text-white/80">{event.speakerTitle}</p>
            <p className="mt-6 text-base text-white/80">{event.location}</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <h3
        className="text-xl font-[900] text-[#1d2087] md:text-2xl lg:text-3xl"
        style={{ WebkitTextStroke: "0.5px #1d2087" }}
      >
        {event.sectionTitle}
      </h3>
      <div className="mt-3 mb-8 h-[2px] w-1/3 bg-[#1d2087]" />

      <div className="flex justify-center">
        {event.link ? (
          <a href={event.link} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-[1.02]">
            {card}
          </a>
        ) : (
          card
        )}
      </div>
    </div>
  );
}
