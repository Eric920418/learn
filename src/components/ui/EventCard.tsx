"use client";

import { useState } from "react";

interface Event {
  date: string;
  titleCn: string;
  titleEn: string;
  speaker: string;
  speakerTitle: string;
  location: string;
}

const events: Event[] = [
  {
    date: "12月26-27日",
    titleCn: "临床下肢生物力学",
    titleEn: "Clinical Biomechanics\nof The Lower Limbs",
    speaker: "主讲人:Dr.Abbie Najjarine",
    speakerTitle: "澳洲足科医师 生物力学大师",
    location: "海南省老年病医院",
  },
  {
    date: "3月15-16日",
    titleCn: "足部矯正治療學",
    titleEn: "Foot Orthotic\nTherapy",
    speaker: "主讲人:Dr. Kevin Kirby",
    speakerTitle: "美國足踝外科醫師",
    location: "台北國際會議中心",
  },
  {
    date: "5月20-21日",
    titleCn: "步態分析臨床應用",
    titleEn: "Clinical Gait\nAnalysis",
    speaker: "主讲人:Dr. Chris Bishop",
    speakerTitle: "英國運動科學家",
    location: "高雄醫學大學",
  },
  {
    date: "8月10-11日",
    titleCn: "運動傷害預防",
    titleEn: "Sports Injury\nPrevention",
    speaker: "主讲人:Dr. Irene Davis",
    speakerTitle: "哈佛醫學院教授",
    location: "台中榮民總醫院",
  },
  {
    date: "10月5-6日",
    titleCn: "兒童足部發展",
    titleEn: "Pediatric Foot\nDevelopment",
    speaker: "主讲人:Dr. Angela Evans",
    speakerTitle: "澳洲兒童足科專家",
    location: "台大醫院國際會議中心",
  },
];

export default function EventCard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const event = events[activeIndex];

  return (
    <div className="relative">
      {/* 卡片 */}
      <div className="relative w-full max-w-lg overflow-hidden">
        {/* 漸層背景 */}
        <div className="bg-gradient-to-br from-gradient-start via-primary-blue to-gradient-end px-6 py-16 text-center text-white md:px-8 md:py-20 lg:px-14 lg:py-28">
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
            <p className="mb-3 text-lg font-medium md:text-xl">{event.date}</p>
            <h3 className="mb-4 text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
              {event.titleCn}
            </h3>
            <p className="mb-6 text-base font-medium leading-snug whitespace-pre-line md:mb-8 md:text-lg">
              {event.titleEn}
            </p>
            <p className="mb-2 text-sm md:text-base">{event.speaker}</p>
            <p className="mb-2 text-sm text-white/80 md:text-base">{event.speakerTitle}</p>
            <p className="mt-6 text-sm text-white/80 md:text-base">{event.location}</p>
          </div>
        </div>
      </div>

      {/* 分頁圓點 — 卡片右下外側 */}
      <div className="mt-6 flex items-center justify-end gap-2 ">
        {events.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            aria-label={`查看第 ${i + 1} 個活動`}
            className={`rounded-full transition-all ${
              i === activeIndex
                ? "h-3 w-3 bg-primary-navy"
                : "h-2 w-2 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

