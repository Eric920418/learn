import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

export default function RecruitPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <PageTitle />
        <FocusSection />
        <SeminarsSection />
        <ResearchSection />
      </main>
      <Footer />
    </>
  );
}

/* ─── 頁面大標題 ─── */
function PageTitle() {
  return (
    <section className="pb-20 pt-20 text-center md:pb-28 md:pt-28 lg:pb-32 lg:pt-32 xl:pb-40 xl:pt-40">
      <h1 className="text-4xl font-black tracking-[0.15em] text-[#1a1464] md:text-6xl lg:text-8xl xl:text-9xl">
        TISCLLB
      </h1>
      <div className="mx-auto mt-4 inline-flex flex-col items-center">
        <h2 className="text-2xl font-bold tracking-[0.15em] text-[#1a1464] lg:text-3xl">
          招募會員
        </h2>
        <div className="mt-2 h-[2px] w-[160%] bg-[#1a1464]/40" />
      </div>
    </section>
  );
}

/* ─── 我們專注於 ─── */
function FocusSection() {
  return (
    <section className="mx-auto  px-6 pb-16 md:px-12 lg:px-24">
      <div className="mb-10">
        <h2 className="text-2xl font-[900] tracking-[0.05em] text-[#1a1464] lg:text-3xl" style={{ WebkitTextStroke: "0.5px #1a1464" }}>
          TISCLLB will be focused on
        </h2>
        <h3 className="mt-1 text-xl font-[900] tracking-[0.1em] text-[#1a1464] lg:text-2xl" style={{ WebkitTextStroke: "0.5px #1a1464" }}>
          我們專注於
        </h3>
      </div>

      <div className="space-y-6">
        <FocusItem
          titleEn="Networking"
          titleCn="人脈"
          descEn="Meeting same minded professionals"
          descCn="遇見志同道合的專業人士"
        />
        <FocusItem
          titleEn="Leadership Skills"
          titleCn="領導力"
          descEn="Making you leaders"
          descCn="使你成為領導者"
        />
        <FocusItem
          titleEn="Professional Development"
          titleCn="專業發展"
          descEn="Continuous seminars"
          descCn="持續的研討會"
        />
        <FocusItem
          titleEn="Partner Programs"
          titleCn="合作夥伴計劃"
          descEn="Working along with other associations"
          descCn="與其他學會合作"
        />

        {/* Business Growth — 特殊：有三欄子項 */}
        <div className="border-l-[10px] border-[#c8dff0] pl-5">
          <div className="mb-3 flex flex-wrap items-center gap-2 md:gap-3">
            <h4 className="text-xl font-bold text-[#5a7a8a] lg:text-2xl">
              Business Growth
            </h4>
            <span className="text-xl font-bold text-[#5a7a8a] lg:text-2xl">
              業務增長
            </span>
            <div className="ml-2 flex-1 border-t border-[#5a7a8a]" />
            <span className="text-[#5a7a8a]">→</span>
          </div>
          {/* 三欄 */}
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3 md:gap-0 md:divide-x md:divide-gray-300">
            <div className="md:pr-4">
              <p className="font-bold text-black">
                Specialist in the field
              </p>
              <p className="font-bold text-black">該領域的專家</p>
            </div>
            <div className="md:px-4">
              <p className="font-bold text-black">
                Referrals from peers
              </p>
              <p className="font-bold text-black">同行推薦</p>
            </div>
            <div className="md:pl-4">
              <p className="font-bold text-black">Word of mouth</p>
              <p className="font-bold text-black">口碑</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FocusItem({
  titleEn,
  titleCn,
  descEn,
  descCn,
}: {
  titleEn: string;
  titleCn: string;
  descEn: string;
  descCn: string;
}) {
  return (
    <div className="border-l-[10px] border-[#c8dff0] pl-5">
      <div className="mb-1 flex flex-wrap items-center gap-2 md:gap-3">
        <h4 className="text-xl font-bold text-[#5a7a8a] lg:text-2xl">
          {titleEn}
        </h4>
        <span className="text-xl font-bold text-[#5a7a8a] lg:text-2xl">
          {titleCn}
        </span>
        <div className="ml-2 flex-1 border-t border-[#5a7a8a]" />
        <span className="text-[#5a7a8a]">→</span>
      </div>
      <p className="text-sm font-bold text-black">{descEn}</p>
      <p className="text-sm font-bold text-black">{descCn}</p>
    </div>
  );
}

/* ─── 研討會及繼續教育 ─── */
function SeminarsSection() {
  return (
    <section className="mx-auto  px-6 py-12 md:px-12 md:py-16 lg:px-24">
      <div className="mb-10">
        <h2
          className="text-2xl font-[900] tracking-[0.05em] text-[#1a1464] lg:text-3xl"
          style={{ WebkitTextStroke: "0.5px #1a1464" }}
        >
          Seminars and Continuing Education
        </h2>
        <h3
          className="mt-1 text-xl font-[900] tracking-[0.1em] text-[#1a1464] lg:text-2xl"
          style={{ WebkitTextStroke: "0.5px #1a1464" }}
        >
          研討會及繼續教育
        </h3>
      </div>

      {/* 第一排：左圖 + 中圖 + 右文（三欄，圖片貼邊） */}
      <div className="-mx-6 mb-12 grid grid-cols-1 gap-3 md:-mx-12 md:grid-cols-3 lg:-mx-24">
        <ImagePlaceholder className="aspect-[4/3]" />
        <ImagePlaceholder className="aspect-[4/3]" />
        <div className="p-6 lg:p-8">
          <p className="text-sm leading-relaxed text-foreground">
            <span className="mr-1 inline-block text-lg text-[#1a1464]">▶</span>
            Continual education is important in professional growth and our
            website will inform our members of all the courses available.
          </p>
          <p className="mt-3 text-sm font-bold leading-relaxed text-foreground">
            繼續教育在專業成長中很重要，我們會於網站告知我會員所有可用的課程。
          </p>
        </div>
      </div>

      {/* 第二排：左文 + 中圖 + 右圖（三欄，圖片貼邊） */}
      <div className="-mx-6 grid grid-cols-1 gap-3 md:-mx-12 md:grid-cols-3 lg:-mx-24">
        <div className="p-6 lg:p-8">
          <p className="text-sm leading-relaxed text-foreground">
            <span className="mr-1 inline-block text-lg text-[#1a1464]">▶</span>
            This also gives our members opportunity to advertise and pass
            knowledge to other members. The courses will need to relate to
            clinical biomechanical training.
          </p>
          <p className="mt-3 text-sm font-bold leading-relaxed text-foreground">
            這也為我們的會員提供了宣傳和向會員傳遞知識的機會。這些課程需要與臨床生物力學訓練相關。
          </p>
        </div>
        <ImagePlaceholder className="aspect-[4/3]" />
        <ImagePlaceholder className="aspect-[4/3]" />
      </div>
    </section>
  );
}

function ImagePlaceholder({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#c8dff0] to-[#9ec5e0] ${className ?? "aspect-[4/3]"}`}>
      <svg
        className="h-10 w-10 text-primary-navy/30"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        />
      </svg>
    </div>
  );
}

/* ─── 研究與發展 ─── */
function ResearchSection() {
  return (
    <section className="mx-auto  px-6 py-12 md:px-12 md:py-16 lg:px-24">
      <div className="mb-6">
        <h2
          className="text-2xl font-[900] tracking-[0.05em] text-[#1a1464] lg:text-3xl"
          style={{ WebkitTextStroke: "0.5px #1a1464" }}
        >
          Research and Development
        </h2>
        <h3
          className="mt-1 text-xl font-[900] tracking-[0.1em] text-[#1a1464] lg:text-2xl"
          style={{ WebkitTextStroke: "0.5px #1a1464" }}
        >
          研究與發展
        </h3>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-foreground">
        In future grants will be provided to students and researches willing to
        undertake studies in the field of clinical biomechanics and related
        areas. To assist and benefit the growth of the profession.
      </p>
      <p className="text-sm leading-relaxed text-foreground">
        在未來，將向願意在臨床生物力學和相關領域進行研究的學生和研究人員提供資助，協助及促進本專業的發展。
      </p>
    </section>
  );
}
