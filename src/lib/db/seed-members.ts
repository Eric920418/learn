import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { associationMembers } from "./schema";
import { eq } from "drizzle-orm";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const members = [
  { sortOrder: 1, nameCn: "高國峯", nameEn: "Dr. Kao Kuo-Feng", workplace: "高國峯骨科診所", email: "rolyfeng@gmail.com" },
  { sortOrder: 2, nameCn: "陳文珊", nameEn: "Chen Wen-Shan", workplace: "新光吳火獅紀念醫院", email: "juliachen1829@gmail.com" },
  { sortOrder: 3, nameCn: "周于翔", nameEn: "Zhou Yu-Xiang", workplace: "三軍總醫院內湖總院-骨科部", email: "chou2658@gmail.com" },
  { sortOrder: 4, nameCn: "韓宗樺", nameEn: "Han Tsung-Hua", workplace: "大安晨熙物理治療所", email: "hch0709@hotmail.com" },
  { sortOrder: 5, nameCn: "丁瑞泰", nameEn: "Ting Jui-Tai", workplace: "祐一復健科診所", email: "b91409005@ntu.edu.tw" },
  { sortOrder: 6, nameCn: "吳坤霖", nameEn: "Dr.Wu Kun-Lin", workplace: "童綜合醫院-復健科", email: "klw52111@ms56.hinet.net" },
  { sortOrder: 7, nameCn: "鍾秉寰", nameEn: "Chung Bing-Hung", workplace: "正佳物理治療所", email: "pt.bbing@gmail.com" },
  { sortOrder: 8, nameCn: "葉怡嘉", nameEn: "Dr. Yeh Yi-Chia", workplace: "童綜合醫院-復健科", email: "yeheca@yahoo.com.tw" },
  { sortOrder: 9, nameCn: "陳昱傑", nameEn: "Dr. Chen Yu-Chieh", workplace: "陳昱傑骨科診所", email: "nouischen@gmail.com" },
  { sortOrder: 10, nameCn: "卓宗成", nameEn: "Zhou Zong-Cheng", workplace: "卓立物理治療所", email: "jow.aaron@msa.hinet.net" },
  { sortOrder: 11, nameCn: "王憲忠", nameEn: "Dr. Wang Hsien-Chung", workplace: "王憲忠骨科診所", email: "enrac_hcwae@gmail.com" },
  { sortOrder: 15, nameCn: "王介山", nameEn: "Dr.Wang, Chieh-Shan", workplace: "王介山骨科外科診所", email: "wang.cs33@msa.hinet.net" },
  { sortOrder: 16, nameCn: "邱谹益", nameEn: "Hong-Yi Chiu", workplace: "以馬內利復健科神經科診所", email: "maxwell715666@gmail.com" },
  { sortOrder: 17, nameCn: "梁福民", nameEn: "Dr.Louis Fukman-Leung", workplace: "仁愛國泰醫院－骨科", email: "lfmleung@gmail.com" },
  { sortOrder: 18, nameCn: "盧文俊", nameEn: "Dr.Lu Wen-Jun", workplace: "常春骨科診所", email: "orifbyplate@gmail.com" },
  { sortOrder: 19, nameCn: "陳柏均", nameEn: "Chen Po-Chun", workplace: "天晟醫院-復健科", email: "freer7722@hotmail.com" },
  { sortOrder: 20, nameCn: "盧異光", nameEn: "Dr.Frank, I.K.Lu", workplace: "慈民骨科診所", email: "bonejoy88@gmail.com" },
  { sortOrder: 21, nameCn: "盧麟", nameEn: "Lin Grant Lu", workplace: "慈民骨科診所", email: "glinlu323@gmail.com" },
  { sortOrder: 22, nameCn: "黃文奇", nameEn: "Dr.Huang Wen-Chi", workplace: "毅嘉骨科診所", email: "wchuang9575038@yahoo.com.tw" },
  { sortOrder: 23, nameCn: "吳湧", nameEn: "Jack Junior Wu", workplace: "CURVES台灣總部 首席運動研發顧問", email: "jackjrwu@me.com" },
  { sortOrder: 24, nameCn: "侯博仁", nameEn: "Hou Po-Jen", workplace: "博證物理治療所", email: "bowrain@gmail.com" },
  { sortOrder: 25, nameCn: "林殿閔", nameEn: "Dr.Lin,Dian-Min", workplace: "敏盛醫院經國院區-骨科", email: "flower77411@gmail.com" },
  { sortOrder: 30, nameCn: "凃富籌", nameEn: "Dr.Twu Fuh-Chour", workplace: "凃富籌復健診所", email: "twu.chh@msa.hinet.net" },
  { sortOrder: 31, nameCn: "陳奕丞", nameEn: "Chen Yi-Cheng", workplace: "小海獺居家職能治療所", email: "eagle72130steven@gmail.com" },
  { sortOrder: 32, nameCn: "劉昱呈", nameEn: "Dr.Liu Yu-Cheng", workplace: "昱安中醫診所", email: "mimic30835@gmail.com" },
  { sortOrder: 33, nameCn: "楊恩", nameEn: "Dr.Yang En", workplace: "國立臺灣大學醫學院附設醫院新竹臺大分院-復健部", email: "youngforever0826@gmail.com" },
  { sortOrder: 34, nameCn: "李易人", nameEn: "Lee I-Jen", workplace: "板橋昌弘復健科診所", email: "ijenlee2001@gmail.com" },
  { sortOrder: 35, nameCn: "董哲樑", nameEn: "Dr.Tung Che-Liang", workplace: "董哲梁骨外科診所", email: "orthojld0789@gmail.com" },
  { sortOrder: 36, nameCn: "", nameEn: "Dr.Teinny Suryadi", workplace: "Medistra Hospital", email: "dokterteinny@gmail.com" },
  { sortOrder: 37, nameCn: "", nameEn: "Dr.Widiya Rahmi Mawardi", workplace: "", email: "Widiyarahmi2016@gmail.com" },
  { sortOrder: 38, nameCn: "", nameEn: "Dr. Riri Prima Yolanda", workplace: "M.Djamil Hospital", email: "dr.ririprima@gmail.com" },
  { sortOrder: 39, nameCn: "王燕如", nameEn: "Dr. Wang, Yen - Ju", workplace: "悅滿意復健專科診所", email: "katrina912@gmail.com" },
];

async function seedMembers() {
  let inserted = 0;
  let skipped = 0;

  for (const member of members) {
    const existing = await db
      .select({ id: associationMembers.id })
      .from(associationMembers)
      .where(eq(associationMembers.email, member.email))
      .limit(1);

    if (existing.length > 0) {
      console.log(`跳過 (已存在): ${member.nameCn || member.nameEn} - ${member.email}`);
      skipped++;
      continue;
    }

    await db.insert(associationMembers).values(member);
    console.log(`新增: ${member.nameCn || member.nameEn} - ${member.email}`);
    inserted++;
  }

  console.log(`\n完成！新增 ${inserted} 筆，跳過 ${skipped} 筆重複`);
  process.exit(0);
}

seedMembers().catch((err) => {
  console.error("匯入失敗:", err);
  process.exit(1);
});
