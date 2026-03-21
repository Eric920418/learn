"use client";

import { useState } from "react";

interface Event {
  id: string;
  date: string;
  titleCn: string;
  titleEn: string;
  speaker: string;
  speakerTitle: string;
  location: string;
}

export default function EventCard({ events }: { events: Event[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (events.length === 0) {
    return <p className="text-gray-500">目前沒有活動</p>;
  }

  const event = events[activeIndex];

  return (
    <div className="relative">
      <div className="relative w-full max-w-lg overflow-hidden">
        <div className="bg-gradient-to-br from-gradient-start via-primary-blue to-gradient-end px-6 py-16 text-center text-white md:px-8 md:py-20 lg:px-14 lg:py-28">
          <div className="pointer-events-none absolute inset-0">
            <svg className="h-full w-full" viewBox="0 0 400 500" fill="none" preserveAspectRatio="none">
              <path d="M0 200 Q200 150, 400 250" stroke="rgba(255,255,255,0.08)" strokeWidth="80" fill="none" />
              <path d="M0 350 Q200 300, 400 400" stroke="rgba(255,255,255,0.05)" strokeWidth="60" fill="none" />
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

      {events.length > 1 && (
        <div className="mt-6 flex items-center justify-end gap-2">
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
      )}
    </div>
  );
}
