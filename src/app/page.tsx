import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import EventCard from "@/components/ui/EventCard";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <PhilosophySection />
        <EventsSection />
      </main>
      <Footer />
    </>
  );
}

/* ─── Hero Section ─── */
function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-65px)] overflow-hidden">
      {/* 全幅背景圖層 */}
      <div className="absolute inset-0">
        {/* 藍色調醫療影像背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#c8dff0] via-[#9ec5e0] to-[#6ba3c9]" />
        {/* 骨骼 X 光 SVG 插圖（右側偏移） */}
        <div className="absolute inset-0 flex items-center justify-end pr-[5%] opacity-30">
          <HeroSkeleton />
        </div>
        {/* 掃描線紋理 */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 3px)",
          }}
        />
      </div>

      {/* 左側白色漸層遮罩 — 讓文字清晰可讀 */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 via-55% to-transparent" />

      {/* 文字內容 */}
      <div className="relative z-10 flex min-h-[calc(100vh-65px)] flex-col justify-center px-6 py-12 md:px-12 md:py-16 lg:px-16 xl:px-24">
        <h2 className="mb-2 text-2xl font-black tracking-[0.2em] text-[#1a1464] md:text-4xl lg:text-5xl xl:text-6xl">
          歡 迎 加 入
        </h2>
        <h1 className="mb-2 text-4xl font-black tracking-[0.12em] text-[#1a1464] md:text-6xl lg:text-8xl xl:text-9xl">
          TISCLLB
        </h1>
        {/* 藍色底線 */}
        <div className="mb-5 h-1 w-40 bg-[#1a1464] md:w-56 lg:w-72" />
        <h2 className="text-2xl font-bold leading-snug text-[#1a1464] md:text-3xl lg:text-4xl xl:text-5xl">
          台灣臨床下肢生物力學
          <br />
          國際學會
        </h2>
        <p className="mt-5 text-sm leading-relaxed tracking-[0.15em] text-[#1a1464]/70 md:text-base lg:text-lg">
          TAIWAN INTERNATIONAL SOCIETY OF &nbsp;CLINICAL
          <br />
          LOWER LIMB BIOMECHANICS
        </p>
      </div>
    </section>
  );
}

/* ─── 倡導理念 Section ─── */
function PhilosophySection() {
  return (
    <section id="philosophy" className="relative overflow-hidden bg-white py-12 md:py-16 lg:py-24">
      {/* 背景淡藍色斜帶 */}
      <div className="pointer-events-none absolute left-[20%] top-[-60%] h-[200%] w-[40%] rotate-[80deg] bg-[#c8dff0]/20" />
      <div className="relative mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        {/* 標題 — 右對齊 + 下方水平線 */}
        <div className="mb-12">
          <h2
            className="text-right text-3xl font-[900] tracking-[0.2em] text-[#1a1464] lg:text-4xl xl:text-5xl"
            style={{ WebkitTextStroke: "1px #1a1464" }}
          >
            倡 導 理 念
          </h2>
          <div className="mt-4 ml-auto h-[2px] w-1/2 bg-[#1a1464]" />
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
  );
}

/* ─── 活動訊息 Section ─── */
function EventsSection() {
  return (
    <section id="events" className="bg-white py-12 md:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        {/* 標題 */}
        <div className="mb-12">
          <h2
            className="text-3xl font-[900] tracking-[0.2em] text-[#1a1464] lg:text-4xl xl:text-5xl"
            style={{ WebkitTextStroke: "1px #1a1464" }}
          >
            活動訊息
          </h2>
          <div className="mt-4 h-[2px] w-1/2 bg-[#1a1464]" />
        </div>

        {/* 活動卡片 */}
        <div className="flex justify-center">
          <EventCard />
        </div>
      </div>
    </section>
  );
}

/* ─── 子元件 ─── */
function BulletPoint({ en, zh }: { en: string; zh: string }) {
  return (
    <div>
      <p className="text-sm font-semibold leading-relaxed text-foreground lg:text-base">
        <span className="mr-1 inline-block text-lg text-[#1a1464]">▶</span>
        {en}
      </p>
      <p className="mt-1 text-sm font-bold leading-relaxed text-foreground lg:text-base">
        {zh}
      </p>
    </div>
  );
}

/* ─── Hero 骨骼 SVG（模擬 X 光淡藍色調） ─── */
function HeroSkeleton() {
  return (
    <svg
      className="h-auto w-full max-w-[260px] md:max-w-[350px] lg:max-w-[420px]"
      viewBox="0 0 420 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 大腿骨 (Femur) */}
      <path
        d="M200 10 C195 10, 178 18, 178 40 L185 220 C185 228, 178 242, 170 250 C162 258, 155 272, 162 285 C170 298, 190 305, 210 305 C230 305, 250 298, 258 285 C265 272, 258 258, 250 250 C242 242, 235 228, 235 220 L242 40 C242 18, 225 10, 220 10 Z"
        stroke="rgba(50,100,160,0.5)"
        strokeWidth="1.5"
        fill="rgba(50,100,160,0.08)"
      />
      {/* 股骨頭圓 */}
      <ellipse cx="210" cy="22" rx="18" ry="14" stroke="rgba(50,100,160,0.3)" strokeWidth="1" fill="rgba(50,100,160,0.04)" />
      {/* 膝蓋 (Patella) */}
      <ellipse
        cx="210"
        cy="310"
        rx="24"
        ry="20"
        stroke="rgba(50,100,160,0.45)"
        strokeWidth="1.5"
        fill="rgba(50,100,160,0.06)"
      />
      {/* 脛骨 (Tibia) */}
      <path
        d="M180 335 C178 335, 172 348, 178 360 L190 530 C190 538, 182 555, 172 572 C165 582, 172 592, 192 592 L222 592 C232 592, 238 585, 232 575 L205 530 L195 360 C200 348, 208 335, 210 335 Z"
        stroke="rgba(50,100,160,0.45)"
        strokeWidth="1.5"
        fill="rgba(50,100,160,0.06)"
      />
      {/* 腓骨 (Fibula) */}
      <path
        d="M242 340 C245 340, 250 355, 247 365 L238 530 C236 548, 240 565, 244 575 C248 585, 242 592, 235 592"
        stroke="rgba(50,100,160,0.35)"
        strokeWidth="1"
        fill="none"
      />
      {/* 關節間隙線 */}
      <line x1="160" y1="315" x2="260" y2="315" stroke="rgba(50,100,160,0.2)" strokeWidth="0.8" strokeDasharray="6 3" />
      <line x1="165" y1="330" x2="255" y2="330" stroke="rgba(50,100,160,0.2)" strokeWidth="0.8" strokeDasharray="6 3" />
      {/* 軟組織輪廓 */}
      <path
        d="M145 40 C130 100, 125 180, 140 260 C148 300, 142 340, 148 400 C155 460, 148 520, 155 590"
        stroke="rgba(50,100,160,0.12)"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M275 40 C290 100, 295 180, 280 260 C272 300, 278 340, 272 400 C265 460, 272 520, 265 590"
        stroke="rgba(50,100,160,0.12)"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}
