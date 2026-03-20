import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <PageTitle />
        <IntroHeader />
        <ValuesSection />
        <AimSection />
        <CharterHeader />
        <DirectorsSection />
        <LeadershipQuote />
        <AssociationPurpose />
        <DirectorsPower />
        <BoardMembers />
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
          關於本會
        </h2>
        <div className="mt-2 h-[2px] w-[160%] bg-[#1a1464]/40" />
      </div>
    </section>
  );
}

/* ─── 本會簡介 標題 ─── */
function IntroHeader() {
  return (
    <section className="mx-auto  px-6 pb-6 md:px-12 lg:px-24">
      <h2
        className="text-3xl font-[900] tracking-[0.2em] text-[#1a1464] lg:text-4xl"
        style={{ WebkitTextStroke: "1px #1a1464" }}
      >
        本會簡介
      </h2>
      <div className="mt-3 h-[2px] w-1/3 bg-[#1a1464]" />
    </section>
  );
}

/* ─── Our Values 圓形圖 ─── */
function ValuesSection() {
  return (
    <section className="mx-auto  px-6 pb-8 md:px-12 lg:px-24">
      <h3 className="text-2xl font-bold text-[#1a1464] lg:text-2xl">
        Our Values for TISCLLB
      </h3>
      <h4 className="mb-8 font-bold text-xl text-[#1a1464] md:text-2xl">
        台灣臨床下肢生物力學國際學會的價值
      </h4>

      {/* 價值觀圓形圖 */}
      <div className="flex justify-center py-4">
      
      </div>
    </section>
  );
}

function ValueBubble({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <div
      className={`absolute flex h-16 w-16 items-center justify-center rounded-full bg-primary-blue text-center text-[10px] font-medium text-white shadow-md lg:h-20 lg:w-20 lg:text-xs ${className}`}
    >
      {label}
    </div>
  );
}

/* ─── Our Aim 我們的目標 ─── */
function AimSection() {
  return (
    <section className="mx-auto  px-6 py-8 md:px-12 lg:px-24">
      <h3 className="text-2xl font-bold text-[#1a1464] lg:text-2xl">
        Our Aim
      </h3>
      <h4 className="mb-6 font-bold text-xl text-[#1a1464] md:text-2xl">我們的目標</h4>

      <div className="space-y-5">
        <AimBullet
          en="Achieving a greater number of trained clinical biomechanical practitioners in all muscular skeletal field of medicine."
          zh="在肌肉骨骼醫學領域培養更多訓練有素的臨床生物力學從業人員。"
        />
        <AimBullet
          en="Having clinicians who understand biomechanical principles and philosophism."
          zh="讓醫人員發有規範的生物力學原理哲學。"
        />
        <AimBullet
          en="Develop a new international medical professionals in the field of clinical biomechanics that treads patients across the globe."
          zh="培養可以跨越國界治療的臨床臨床生物力學領域的國際醫學專業人才"
        />
      </div>

      {/* 國際網絡圖 */}
      <div className="mt-10 flex justify-center">
     
      </div>
    </section>
  );
}

function AimBullet({ en, zh }: { en: string; zh: string }) {
  return (
    <div>
      <p className="text-sm leading-relaxed text-foreground lg:text-base">
        <span className="mr-1 inline-block text-lg text-[#1a1464]">▶</span>
        {en}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-text-gray lg:text-base">
        {zh}
      </p>
    </div>
  );
}

function NetworkNode({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="rounded-lg bg-white/15 px-2 py-2">
      <p className="font-bold">{label}</p>
      <p className="text-[10px] text-white/80">{sub}</p>
    </div>
  );
}

/* ─── 本會章程 標題 ─── */
function CharterHeader() {
  return (
    <section className="mx-auto  px-6 pt-16 pb-6 md:px-12 lg:px-24">
      <h2
        className="text-3xl font-[900] tracking-[0.2em] text-[#1a1464] lg:text-4xl"
        style={{ WebkitTextStroke: "1px #1a1464" }}
      >
        本會章程
      </h2>
      <div className="mt-3 h-[2px] w-1/3 bg-[#1a1464]" />
    </section>
  );
}

/* ─── Why Have TISCLLB DIRECTORS? ─── */
function DirectorsSection() {
  return (
    <section className="mx-auto  px-6 pb-8 md:px-12 lg:px-24">
      <h3 className="text-2xl font-bold text-[#1a1464] lg:text-2xl">
        Why Have TISCLLB DIRECTORS?
      </h3>
      <h4 className="mb-6 font-bold text-xl text-[#1a1464] md:text-2xl">
        為什麼要設置TISCLLB理事？
      </h4>

      <div className="space-y-4">
        <DirectorBullet
          en="Recognition as an Accredited Member/Director of the TISCLLB"
          zh="認證為TISCLLB會員/處理事"
        />
        <DirectorBullet
          en="Being leaders of your peers with the same interests."
          zh="成為與你有相同興趣的同行的領導者"
        />
        <DirectorBullet
          en="Willing to share knowledge with others"
          zh="願意與他人分享知識"
        />
        <DirectorBullet
          en="Willing to educate your experiences"
          zh="願意分享自己的經驗"
        />
        <DirectorBullet en="Networking others" zh="與他人交流" />
        <DirectorBullet en="Member discounts" zh="會員折扣" />
        <DirectorBullet
          en="Share your knowledge with TISCLLB member"
          zh="與TISCLLB會員分享知識"
        />
        <DirectorBullet
          en="Assist countries that need the resources of cooperation"
          zh="協助需要合作資源的國家"
        />
        <DirectorBullet en="Lobby Governments" zh="遊說政府" />
      </div>
    </section>
  );
}

function DirectorBullet({ en, zh }: { en: string; zh: string }) {
  return (
    <div>
      <p className="text-sm text-foreground lg:text-base">
        <span className="mr-1 inline-block text-lg text-[#1a1464]">▶</span>
        {en}
      </p>
      <p className="mt-0.5 text-sm text-text-gray">{zh}</p>
    </div>
  );
}

/* ─── 領導力大字引言 ─── */
function LeadershipQuote() {
  return (
    <section className="relative mx-auto px-6 pb-12 md:px-12 lg:px-24">
      <span className="absolute left-2 top-[-10px] text-3xl leading-none text-[#1a1464] md:left-[-10px] md:top-[-15px] md:text-4xl lg:left-[-20px] lg:top-[-20px] lg:text-7xl">▶</span>
      <div>
          <h2 className="text-2xl font-black italic leading-tight text-[#1a1464] lg:text-3xl xl:text-4xl">
            For most practitioners,
            <br />
            creating professional
            <br />
            <span className="relative isolate inline-block after:absolute after:bottom-0 after:left-0 after:-z-10 after:h-[40%] after:w-full after:bg-[#d4870e] after:content-['']">LEADERSHIP</span>{" "}
            is important
          </h2>
          <p className="mt-3 text-xl font-bold text-[#1a1464] lg:text-2xl">
            對於大多數從業者來說
            <br />
            建立專業的
            <span className="relative isolate inline-block after:absolute after:bottom-0 after:left-0 after:-z-10 after:h-[40%] after:w-full after:bg-[#d4870e] after:content-['']">領導力</span>
            很重要
          </p>
        </div>
    </section>
  );
}

/* ─── What is the association for? ─── */
function AssociationPurpose() {
  return (
    <section className="mx-auto  px-6 pb-8 md:px-12 lg:px-24">
      <h3 className="text-2xl font-bold text-[#1a1464] lg:text-2xl">
        What is the association for?
      </h3>
      <h4 className="mb-6 font-bold text-xl text-[#1a1464] md:text-2xl">
        學會的目的是什麼？
      </h4>

      <div className="space-y-5">
        <AimBullet
          en="Making a community between Clinical biomechanics of practitioners is very critical."
          zh="在臨床生物力學從業者之間建立社區至關重要。"
        />
        <AimBullet
          en="In general, an association is a group of professionals banded together for a specific purpose, a bit like a union. As a member of an association you have the opportunity to be active, share your ideas, become a member of a committee or volunteer to be a speaker."
          zh="一般來說，學會是一群專業人士為了一個特定的目的而聚在一起，有點像一個聯盟。作為學會的成員，您有機會積極參與、分享您的想法、成為委員會成員或自願成為演講者。"
        />
        <AimBullet
          en="This helps you as a Director/member/improve your reputation as an expert in your field."
          zh="這有助於您作為理事/會員提高您作為該領域專家的聲譽"
        />
      </div>
    </section>
  );
}

/* ─── Directors IS POWER ─── */
function DirectorsPower() {
  return (
    <section className="mx-auto  px-6 pb-12 md:px-12 lg:px-24">
      <div className="text-center">
        <h2 className="text-2xl font-black italic text-[#d4870e] md:text-3xl lg:text-5xl xl:text-6xl">
          Directors IS POWER to shape this
          <br />
          association
        </h2>
        <p className="mt-4 text-xl font-black text-[#d4870e] md:text-2xl lg:text-4xl">
          理監事們是塑造這個學會的力量
        </p>
      </div>

      <div className="mt-8 space-y-4">
        <p className="text-sm leading-relaxed text-foreground lg:text-base">
          I believe not only placing TISCLLB Directorship after your title is
          impressive, but providing you with the recognition by your colleagues
          and your patient that you a specialist in this field.
        </p>
        <p className="text-sm leading-relaxed text-foreground lg:text-base">
          我認為在你的頭銜後面加上TISCLLB的理監事頭銜不僅令人印象深刻，而且還讓你的同事和患者認可你是該領域的專家。
        </p>
      </div>
    </section>
  );
}

/* ─── 組織成員 ─── */
function BoardMembers() {
  return (
    <section className="mx-auto  px-6 pb-12 md:px-12 lg:px-24">
      <h2
        className="text-3xl font-[900] tracking-[0.2em] text-[#1a1464] lg:text-4xl"
        style={{ WebkitTextStroke: "1px #1a1464" }}
      >
        組織成員
      </h2>
      <div className="mt-3 mb-8 h-[2px] w-1/3 bg-[#1a1464]" />
      <div className="mb-8">
        <p className="font-black text-[#1a1464] text-xl md:text-2xl">第一屆</p>
        <p className="font-black text-[#1a1464] text-xl md:text-2xl">
          台灣臨床下肢生物力學國際學會
        </p>
        <p className="font-black text-[#1a1464] text-xl md:text-2xl">理監事</p>
      </div>

      {/* 成員照片格 */}
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
        <MemberCard
          name="Dr. Abbie Najjarine"
          titleCn="創辦人"
          titleEn="Founder"
        />
        <MemberCard
          name="Dr. Wu Kun-Lin"
          titleCn="副理事長"
          titleEn="Vice Chairman"
        />
        <MemberCard
          name="Chen Wen-Shan"
          titleCn="秘書長"
          titleEn="Secretary General"
        />
        <MemberCard
          name="Zhou Zong-Cheng"
          titleCn="理事"
          titleEn="Director"
        />
        <MemberCard
          name="Maria Chen"
          titleCn="理事"
          titleEn="Director"
        />
        <MemberCard
          name="Chung Bing-Hung"
          titleCn="理事"
          titleEn="Director"
        />
        <MemberCard
          name="Hou Po-Jen"
          titleCn="監事"
          titleEn="Supervisor"
        />
        <MemberCard
          name="Dr. Kao Kuo-Feng"
          titleCn="監事"
          titleEn="Supervisor"
        />
      </div>
    </section>
  );
}

function MemberCard({
  name,
  titleCn,
  titleEn,
}: {
  name: string;
  titleCn: string;
  titleEn: string;
}) {
  return (
    <div className="text-center">
      {/* 佔位頭像 */}
      <div className="mx-auto mb-3 flex h-28 w-28 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#c8dff0] to-[#9ec5e0] lg:h-32 lg:w-32">
        <svg
          className="h-12 w-12 text-primary-navy/30"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </svg>
      </div>
      <p className="text-xs font-bold text-primary-navy">{name}</p>
      <p className="text-xs text-primary-blue">{titleCn}</p>
      <p className="text-[10px] text-text-gray">{titleEn}</p>
    </div>
  );
}
