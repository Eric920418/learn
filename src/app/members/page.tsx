import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

interface Member {
  nameCn: string;
  nameEn: string;
  workplace: string;
  email: string;
  email2?: string;
}

const members: Member[] = [
  {
    nameCn: "高國峯",
    nameEn: "Dr. Kao Kuo-Feng",
    workplace: "高國峯骨科診所",
    email: "rolyfeng@gmail.com",
  },
  {
    nameCn: "陳文珊",
    nameEn: "Chen Wen-Shan",
    workplace: "新光吳火獅紀念醫院",
    email: "juliachen1829@gmail.com",
  },
  {
    nameCn: "周于翔",
    nameEn: "Zhou Yu-Xiang",
    workplace: "三軍總醫院內湖總院-骨科部",
    email: "chou2658@gmail.com",
  },
  {
    nameCn: "韓宗樺",
    nameEn: "Han Tsung-Hua",
    workplace: "大安晨熙物理治療所",
    email: "hch0709@hotmail.com",
  },
  {
    nameCn: "丁瑞泰",
    nameEn: "Ting Jui-Tai",
    workplace: "祐一復健科診所",
    email: "b91409005@ntu.edu.tw",
  },
  {
    nameCn: "吳坤霖",
    nameEn: "Dr.Wu Kun-Lin",
    workplace: "童綜合醫院-復健科",
    email: "klw52111@ms56.hinet.net",
  },
  {
    nameCn: "鍾秉寰",
    nameEn: "Chung Bing-Hung",
    workplace: "正佳物理治療所",
    email: "pt.bbing@gmail.com",
  },
  {
    nameCn: "葉怡嘉",
    nameEn: "Dr. Yeh Yi-Chia",
    workplace: "童綜合醫院-復健科",
    email: "yeheca@yahoo.com.tw",
  },
  {
    nameCn: "陳昱傑",
    nameEn: "Dr. Chen Yu-Chieh",
    workplace: "陳昱傑骨科診所",
    email: "nouischen@gmail.com",
  },
  {
    nameCn: "卓宗成",
    nameEn: "Zhou Zong-Cheng",
    workplace: "卓立物理治療所",
    email: "jow.aaron@msa.hinet.net",
  },
  {
    nameCn: "王憲忠",
    nameEn: "Dr. Wang Hsien-Chung",
    workplace: "王憲忠骨科診所",
    email: "enrac_hcwang@yahoo.com.tw",
  },
  {
    nameCn: "許民華",
    nameEn: "Hsu Ming Hua",
    workplace: "新安物理治療所",
    email: "hsu_ming_hua@yahoo.com.tw",
  },
  {
    nameCn: "龔洧萱",
    nameEn: "Kung Wei-Hsuan",
    workplace: "共和復健科診所",
    email: "weikung@yahoo.com",
    email2: "allywkung@yahoo.com.tw",
  },
  {
    nameCn: "林東亮",
    nameEn: "Dr. Lin Tung-Liang",
    workplace: "臺中榮民總醫院-復健科",
    email: "safetymarginescape@gmail.com",
  },
  {
    nameCn: "王介山",
    nameEn: "Dr.Wang, Chieh-Shan",
    workplace: "王介山骨科外科診所",
    email: "wang.cs33@msa.hinet.net",
  },
  {
    nameCn: "邱弘益",
    nameEn: "Hong-Yi Chiu",
    workplace: "以馬內利復健科神經科診所",
    email: "maxwell715666@gmail.com",
  },
  {
    nameCn: "梁福民",
    nameEn: "Dr.Louis Fukman-Leung",
    workplace: "仁愛國泰醫院－骨科",
    email: "lfmleung@gmail.com",
  },
  {
    nameCn: "盧文俊",
    nameEn: "Dr.Lu Wen-Jun",
    workplace: "常春骨科診所",
    email: "orifbyplate@gmail.com",
  },
  {
    nameCn: "陳柏均",
    nameEn: "Chen Po-Chun",
    workplace: "天晟醫院-復健科",
    email: "freer7722@hotmail.com",
  },
  {
    nameCn: "盧異光",
    nameEn: "Dr.Frank, I.K.Lu",
    workplace: "慈民骨科診所",
    email: "bonejoy88@gmail.com",
  },
];

export default function MembersPage() {
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
              會員名單
            </h2>
            <div className="mt-2 h-[2px] w-[160%] bg-[#1a1464]/40" />
          </div>
        </section>

        {/* 會員列表 */}
        <section className="mx-auto  px-6 pb-16 md:px-12 md:pb-20 lg:px-24">
          {/* 表頭 */}
          <div className="flex border-b-2 border-primary-navy/20 pb-3 text-xs font-bold text-primary-navy md:text-sm">
            <div className="w-8 shrink-0 md:w-10" />
            <div className="flex-1">姓名</div>
            <div className="flex-1 text-right lg:text-left">
              工作單位 / E-mail
            </div>
          </div>

          {/* 會員列表 */}
          {members.map((m, i) => (
            <div key={i} className="flex border-b border-gray-200 py-3 text-sm md:py-4">
              {/* 編號 */}
              <div className="w-8 shrink-0 flex items-center justify-center text-sm font-bold text-primary-navy md:w-10 md:ms-[-10px] md:text-lg">
                {i + 1}
              </div>

              {/* 姓名 */}
              <div className="flex-1">
                <p className="font-black text-sm text-[#1a1464] md:text-base lg:text-lg">{m.nameCn}</p>
                <p className="text-xs text-[#1a1464] md:text-sm lg:text-lg">{m.nameEn}</p>
              </div>

              {/* 工作單位 / Email */}
              <div className="flex-1 text-right lg:text-left">
                <p className="text-xs text-[#1a1464] md:text-sm lg:text-lg">{m.workplace}</p>
                <p className="break-all text-xs text-[#1a1464] md:text-sm lg:text-lg">{m.email}</p>
                {m.email2 && (
                  <p className="break-all text-xs text-[#1a1464] md:text-sm lg:text-lg">{m.email2}</p>
                )}
              </div>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
