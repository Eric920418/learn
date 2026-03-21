import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import {
  users,
  siteSettings,
  heroContent,
  philosophyItems,
  boardMembers,
  aboutAims,
  aboutDirectors,
  aboutPurposes,
  events,
  associationMembers,
  focusItems,
  pageSections,
} from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seed() {
  console.log("開始 Seed...");

  // 1. Admin 帳號
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await db
    .insert(users)
    .values({
      name: "Admin",
      email: "admin@tiscllb.org",
      password: hashedPassword,
      role: "admin",
    })
    .onConflictDoNothing();
  console.log("✓ Admin 帳號建立完成 (admin@tiscllb.org / admin123)");

  // 2. 全站設定
  const existingSettings = await db.select().from(siteSettings).limit(1);
  if (existingSettings.length === 0) {
    await db.insert(siteSettings).values({
      address: "10487台北市中山區復興北路154號5樓",
      tel: "02-2717-0031",
      fax: "02-2718-1243",
      email: "twn.globe@gmail.com",
      copyrightText: "Copyright © 台灣臨床下肢生物力學國際學會",
    });
  }
  console.log("✓ 全站設定");

  // 3. Hero
  const existingHero = await db.select().from(heroContent).limit(1);
  if (existingHero.length === 0) {
    await db.insert(heroContent).values({
      titleLine1: "歡 迎 加 入",
      titleLine2: "TISCLLB",
      subtitleCn: "台灣臨床下肢生物力學\n國際學會",
      subtitleEn: "TAIWAN INTERNATIONAL SOCIETY OF  CLINICAL\nLOWER LIMB BIOMECHANICS",
      announcementText: "2026正式啟動",
      heroImage: "/TISCLLB-web_首頁＿首圖.jpg",
    });
  }
  console.log("✓ Hero 內容");

  // 4. 倡導理念
  const existingPhilosophy = await db.select().from(philosophyItems).limit(1);
  if (existingPhilosophy.length === 0) {
    await db.insert(philosophyItems).values([
      {
        category: "goal",
        contentEn: "To help infrastructure decision-makers understand and accept what is clinical biomechanics and how this field assists in improving the well-being of patients using conservative treatments and reducing patients pain without the use of invasive surgical treatments.",
        contentCn: "幫助基礎入門決策者理解和接受什麼是臨床生物力學，以及該領域如何幫助使用保守治療改善患者的健康狀況，並在不使用侵入性手術治療的情況下減輕患者的痛苦。",
        sortOrder: 0,
      },
      {
        category: "goal",
        contentEn: "To create a better educated public on clinical biomechanics and provide acceptance by law makers on the necessity of the profession in the medical field.",
        contentCn: "使公眾在臨床生物力學方面受到更好的教育，並讓立法者接受醫學領域專業的必要性。",
        sortOrder: 1,
      },
      {
        category: "vision",
        contentEn: "Our Goal is initial to grow each country nationally and be part of an international same mined professionals.",
        contentCn: "我們的目標是首先在每個國家發展，並成為國際相同挖掘專業人士的一部分。",
        sortOrder: 2,
      },
      {
        category: "vision",
        contentEn: "Member retention is just as important as recruitment. For us, that means adding distinct member value through continuing education, advanced job opportunities, networking practice groups, scholarship and grant opportunities, and student loan financing.",
        contentCn: "會員保留與招募同樣重要。對我們來說，這意味著通過繼續教育、高級工作機會、網絡實踐小組、獎學金和助學金機會以及學生貸款融資來增加獨特的會員價值。",
        sortOrder: 3,
      },
    ]);
  }
  console.log("✓ 倡導理念");

  // 5. 組織成員
  const existingBoard = await db.select().from(boardMembers).limit(1);
  if (existingBoard.length === 0) {
    await db.insert(boardMembers).values([
      { nameEn: "Dr. Abbie Najjarine", titleEn: "IACB總會長", titleCn: "(澳大利亞)", image: "/組織成員/TISCLLB web-01.jpg", sortOrder: 0 },
      { nameEn: "Dr. Wu Kun Lin", titleEn: "Chairman of Director", titleCn: "理事長-吳坤霖", image: "/組織成員/TISCLLB web-02.jpg", sortOrder: 1 },
      { nameEn: "Chen Wun Shan", titleEn: "Executive director", titleCn: "常務理事-陳文珊", image: "/組織成員/TISCLLB web-03.jpg", sortOrder: 2 },
      { nameEn: "Zhou Zong Chen", titleEn: "Executive director", titleCn: "常務理事-卓宗成", image: "/組織成員/TISCLLB web-04.jpg", sortOrder: 3 },
      { nameEn: "Maria Chen", titleEn: "TAIWAN Founder", titleCn: "台灣創辦人-陳秀鸞", image: "/組織成員/TISCLLB web-05.jpg", sortOrder: 4 },
      { nameEn: "Chung Bing Hung", titleEn: "director", titleCn: "理事-鍾秉寰", image: "/組織成員/TISCLLB web-06.jpg", sortOrder: 5 },
      { nameEn: "Hou Po Jen", titleEn: "director", titleCn: "理事-侯博仁", image: "/組織成員/TISCLLB web-07.jpg", sortOrder: 6 },
      { nameEn: "Dr. Kao Kou Feng", titleEn: "director", titleCn: "理事-高國峯", image: "/組織成員/TISCLLB web-08.jpg", sortOrder: 7 },
    ]);
  }
  console.log("✓ 組織成員");

  // 6. About Aims
  const existingAims = await db.select().from(aboutAims).limit(1);
  if (existingAims.length === 0) {
    await db.insert(aboutAims).values([
      { contentEn: "Achieving a greater number of trained clinical biomechanical practitioners in all muscular skeletal field of medicine.", contentCn: "在肌肉骨骼醫學領域培養更多訓練有素的臨床生物力學從業人員。", sortOrder: 0 },
      { contentEn: "Having clinicians who understand biomechanical principles and philosophism.", contentCn: "讓醫人員發有規範的生物力學原理哲學。", sortOrder: 1 },
      { contentEn: "Develop a new international medical professionals in the field of clinical biomechanics that treads patients across the globe.", contentCn: "培養可以跨越國界治療的臨床臨床生物力學領域的國際醫學專業人才", sortOrder: 2 },
    ]);
  }
  console.log("✓ About Aims");

  // 7. About Directors
  const existingDirectors = await db.select().from(aboutDirectors).limit(1);
  if (existingDirectors.length === 0) {
    await db.insert(aboutDirectors).values([
      { contentEn: "Recognition as an Accredited Member/Director of the TISCLLB", contentCn: "認證為TISCLLB會員/處理事", sortOrder: 0 },
      { contentEn: "Being leaders of your peers with the same interests.", contentCn: "成為與你有相同興趣的同行的領導者", sortOrder: 1 },
      { contentEn: "Willing to share knowledge with others", contentCn: "願意與他人分享知識", sortOrder: 2 },
      { contentEn: "Willing to educate your experiences", contentCn: "願意分享自己的經驗", sortOrder: 3 },
      { contentEn: "Networking others", contentCn: "與他人交流", sortOrder: 4 },
      { contentEn: "Member discounts", contentCn: "會員折扣", sortOrder: 5 },
      { contentEn: "Share your knowledge with TISCLLB member", contentCn: "與TISCLLB會員分享知識", sortOrder: 6 },
      { contentEn: "Assist countries that need the resources of cooperation", contentCn: "協助需要合作資源的國家", sortOrder: 7 },
      { contentEn: "Lobby Governments", contentCn: "遊說政府", sortOrder: 8 },
    ]);
  }
  console.log("✓ About Directors");

  // 8. About Purposes
  const existingPurposes = await db.select().from(aboutPurposes).limit(1);
  if (existingPurposes.length === 0) {
    await db.insert(aboutPurposes).values([
      { contentEn: "Making a community between Clinical biomechanics of practitioners is very critical.", contentCn: "在臨床生物力學從業者之間建立社區至關重要。", sortOrder: 0 },
      { contentEn: "In general, an association is a group of professionals banded together for a specific purpose, a bit like a union. As a member of an association you have the opportunity to be active, share your ideas, become a member of a committee or volunteer to be a speaker.", contentCn: "一般來說，學會是一群專業人士為了一個特定的目的而聚在一起，有點像一個聯盟。作為學會的成員，您有機會積極參與、分享您的想法、成為委員會成員或自願成為演講者。", sortOrder: 1 },
      { contentEn: "This helps you as a Director/member/improve your reputation as an expert in your field.", contentCn: "這有助於您作為理事/會員提高您作為該領域專家的聲譽", sortOrder: 2 },
    ]);
  }
  console.log("✓ About Purposes");

  // 9. 活動
  const existingEvents = await db.select().from(events).limit(1);
  if (existingEvents.length === 0) {
    await db.insert(events).values([
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
        published: true,
        sortOrder: 0,
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
        published: true,
        sortOrder: 1,
      },
    ]);
  }
  console.log("✓ 活動");

  // 10. 會員名單
  const existingMembers = await db.select().from(associationMembers).limit(1);
  if (existingMembers.length === 0) {
    const memberData = [
      { nameCn: "高國峯", nameEn: "Dr. Kao Kuo-Feng", workplace: "高國峯骨科診所", email: "rolyfeng@gmail.com" },
      { nameCn: "陳文珊", nameEn: "Chen Wen-Shan", workplace: "新光吳火獅紀念醫院", email: "juliachen1829@gmail.com" },
      { nameCn: "周于翔", nameEn: "Zhou Yu-Xiang", workplace: "三軍總醫院內湖總院-骨科部", email: "chou2658@gmail.com" },
      { nameCn: "韓宗樺", nameEn: "Han Tsung-Hua", workplace: "大安晨熙物理治療所", email: "hch0709@hotmail.com" },
      { nameCn: "丁瑞泰", nameEn: "Ting Jui-Tai", workplace: "祐一復健科診所", email: "b91409005@ntu.edu.tw" },
      { nameCn: "吳坤霖", nameEn: "Dr.Wu Kun-Lin", workplace: "童綜合醫院-復健科", email: "klw52111@ms56.hinet.net" },
      { nameCn: "鍾秉寰", nameEn: "Chung Bing-Hung", workplace: "正佳物理治療所", email: "pt.bbing@gmail.com" },
      { nameCn: "葉怡嘉", nameEn: "Dr. Yeh Yi-Chia", workplace: "童綜合醫院-復健科", email: "yeheca@yahoo.com.tw" },
      { nameCn: "陳昱傑", nameEn: "Dr. Chen Yu-Chieh", workplace: "陳昱傑骨科診所", email: "nouischen@gmail.com" },
      { nameCn: "卓宗成", nameEn: "Zhou Zong-Cheng", workplace: "卓立物理治療所", email: "jow.aaron@msa.hinet.net" },
      { nameCn: "王憲忠", nameEn: "Dr. Wang Hsien-Chung", workplace: "王憲忠骨科診所", email: "enrac_hcwang@yahoo.com.tw" },
      { nameCn: "許民華", nameEn: "Hsu Ming Hua", workplace: "新安物理治療所", email: "hsu_ming_hua@yahoo.com.tw" },
      { nameCn: "龔洧萱", nameEn: "Kung Wei-Hsuan", workplace: "共和復健科診所", email: "weikung@yahoo.com", email2: "allywkung@yahoo.com.tw" },
      { nameCn: "林東亮", nameEn: "Dr. Lin Tung-Liang", workplace: "臺中榮民總醫院-復健科", email: "safetymarginescape@gmail.com" },
      { nameCn: "王介山", nameEn: "Dr.Wang, Chieh-Shan", workplace: "王介山骨科外科診所", email: "wang.cs33@msa.hinet.net" },
      { nameCn: "邱弘益", nameEn: "Hong-Yi Chiu", workplace: "以馬內利復健科神經科診所", email: "maxwell715666@gmail.com" },
      { nameCn: "梁福民", nameEn: "Dr.Louis Fukman-Leung", workplace: "仁愛國泰醫院－骨科", email: "lfmleung@gmail.com" },
      { nameCn: "盧文俊", nameEn: "Dr.Lu Wen-Jun", workplace: "常春骨科診所", email: "orifbyplate@gmail.com" },
      { nameCn: "陳柏均", nameEn: "Chen Po-Chun", workplace: "天晟醫院-復健科", email: "freer7722@hotmail.com" },
      { nameCn: "盧異光", nameEn: "Dr.Frank, I.K.Lu", workplace: "慈民骨科診所", email: "bonejoy88@gmail.com" },
    ];
    await db.insert(associationMembers).values(
      memberData.map((m, i) => ({ ...m, sortOrder: i }))
    );
  }
  console.log("✓ 會員名單");

  // 11. 招募會員 Focus Items
  const existingFocus = await db.select().from(focusItems).limit(1);
  if (existingFocus.length === 0) {
    await db.insert(focusItems).values([
      { titleEn: "Networking", titleCn: "人脈", descEn: "Meeting same minded professionals", descCn: "遇見志同道合的專業人士", sortOrder: 0 },
      { titleEn: "Leadership Skills", titleCn: "領導力", descEn: "Making you leaders", descCn: "使你成為領導者", sortOrder: 1 },
      { titleEn: "Professional Development", titleCn: "專業發展", descEn: "Continuous seminars", descCn: "持續的研討會", sortOrder: 2 },
      { titleEn: "Partner Programs", titleCn: "合作夥伴計劃", descEn: "Working along with other associations", descCn: "與其他學會合作", sortOrder: 3 },
      {
        titleEn: "Business Growth", titleCn: "業務增長", descEn: "", descCn: "",
        subItems: JSON.stringify(["Specialist in the field\n該領域的專家", "Referrals from peers\n同行推薦", "Word of mouth\n口碑"]),
        sortOrder: 4,
      },
    ]);
  }
  console.log("✓ 招募會員 Focus Items");

  // 12. Page Sections
  const existingSections = await db.select().from(pageSections).limit(1);
  if (existingSections.length === 0) {
    await db.insert(pageSections).values([
      {
        pageSlug: "about",
        sectionKey: "leadership_quote",
        contentEn: "For most practitioners, creating professional LEADERSHIP is important",
        contentCn: "對於大多數從業者來說 建立專業的領導力很重要",
      },
      {
        pageSlug: "about",
        sectionKey: "directors_power",
        contentEn: "I believe not only placing TISCLLB Directorship after your title is impressive, but providing you with the recognition by your colleagues and your patient that you a specialist in this field.",
        contentCn: "我認為在你的頭銜後面加上TISCLLB的理監事頭銜不僅令人印象深刻，而且還讓你的同事和患者認可你是該領域的專家。",
      },
      {
        pageSlug: "recruit",
        sectionKey: "seminars_text",
        contentEn: "Continual education is important in professional growth and our website will inform our members of all the courses available.|||This also gives our members opportunity to advertise and pass knowledge to other members. The courses will need to relate to clinical biomechanical training.",
        contentCn: "繼續教育在專業成長中很重要，我們會於網站告知我會員所有可用的課程。|||這也為我們的會員提供了宣傳和向會員傳遞知識的機會。這些課程需要與臨床生物力學訓練相關。",
      },
      {
        pageSlug: "recruit",
        sectionKey: "research_text",
        contentEn: "In future grants will be provided to students and researches willing to undertake studies in the field of clinical biomechanics and related areas. To assist and benefit the growth of the profession.",
        contentCn: "在未來，將向願意在臨床生物力學和相關領域進行研究的學生和研究人員提供資助，協助及促進本專業的發展。",
      },
      {
        pageSlug: "contact",
        sectionKey: "welcome",
        contentEn: "歡迎您提供寶貴的意見，若想尋求合作或有其他需求",
        contentCn: "感謝您造訪TISCLLB的網站。",
      },
    ]);
  }
  console.log("✓ Page Sections");

  console.log("\n✅ Seed 完成！");
  console.log("Admin 帳號: admin@tiscllb.org / admin123");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed 失敗:", err);
  process.exit(1);
});
