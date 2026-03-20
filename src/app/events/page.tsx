import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

interface EventData {
  date: string;
  titleCn: string;
  titleEn: string;
  speaker: string;
  speakerTitle: string;
  location: string;
  color: "blue" | "orange";
  sectionTitle: string;
  info: string;
}

const events: EventData[] = [
  {
    sectionTitle: "生 物 力 學 講 座（標題）",
    date: "12月26-27日",
    titleCn: "临床下肢生物力学",
    titleEn: "Clinical Biomechanics\nof The Lower Limbs",
    speaker: "主讲人:Dr.Abbie Najjarine",
    speakerTitle: "澳洲足科医师 生物力学大师",
    location: "海南省老年病医院",
    color: "blue",
    info: "活動資訊內容活動資訊內容活動資訊內容活動資訊內容活動資訊內容活動資訊內容活動資訊內容活動資訊內容活動資訊內容",
  },
  {
    sectionTitle: "生 物 力 學 講 座（標題）",
    date: "8月31日",
    titleCn: "下肢关节骨头松动术",
    titleEn: "Mobilization and\nManipulation",
    speaker: "主讲人:Dr.Abbie Najjarine",
    speakerTitle: "澳洲足科医师 生物力学大师",
    location: "无锡佑一加康复医疗中心",
    color: "orange",
    info: "活動資訊內容活動資訊內容活動資訊內容活動資訊內容活動資訊內容活動資訊內容活動資訊內容活動資訊內容活動資訊內容",
  },
];

export default function EventsPage() {
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
              活動訊息
            </h2>
            <div className="mt-2 h-[2px] w-[160%] bg-[#1a1464]/40" />
          </div>
        </section>

        {/* 活動列表 */}
        <section className="mx-auto  px-6 pb-16 md:px-12 md:pb-20 lg:px-24">
          <div className="space-y-12 md:space-y-16 lg:space-y-20">
            {events.map((event, i) => (
              <EventBlock key={i} event={event} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function EventBlock({ event }: { event: EventData }) {
  const gradientClass = "from-gradient-start via-primary-blue to-gradient-end";

  return (
    <div>
      {/* 講座標題 */}
      <h3
        className="text-xl font-[900]  text-[#1a1464] md:text-2xl lg:text-3xl"
        style={{ WebkitTextStroke: "0.5px #1a1464" }}
      >
        {event.sectionTitle}
      </h3>
      <div className="mt-3 mb-8 h-[2px] w-1/3 bg-[#1a1464]" />

      {/* 活動卡片 */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-sm overflow-hidden">
          <div
            className={`bg-gradient-to-br ${gradientClass} px-6 py-20 text-center text-white md:px-8 md:py-28 lg:px-10 lg:py-36`}
          >
            {/* 裝飾弧線 */}
            <div className="pointer-events-none absolute inset-0">
              <svg
                className="h-full w-full"
                viewBox="0 0 400 500"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 200 Q200 150, 400 250"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="80"
                  fill="none"
                />
                <path
                  d="M0 350 Q200 300, 400 400"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="60"
                  fill="none"
                />
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
              <p className="mb-2 text-base text-white/80">
                {event.speakerTitle}
              </p>
              <p className="mt-6 text-base text-white/80">{event.location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 活動資訊 */}
      <div className="mt-10">
        <p className="mb-2 font-medium text-foreground">
          <span className="mr-1 text-primary-navy">▶</span>活動資訊
        </p>
        <p className="text-sm leading-relaxed text-foreground/80">
          {event.info}
        </p>
      </div>
    </div>
  );
}
