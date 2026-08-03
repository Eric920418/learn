import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { getPublishedVideos } from "@/lib/queries/videos";
import { VideoGallery } from "@/components/ui/VideoGallery";

// 與所有前台公開頁一致。理由見 README「渲染策略」：build container 在 iad1、
// Neon 在新加坡，build 期 prerender 會跨太平洋打 DB 而 ETIMEDOUT。
export const dynamic = "force-dynamic";

// 暫時性：功能尚未驗收，導覽列入口已隱藏（見 Header.tsx）。這裡再擋一道搜尋
// 引擎，避免空頁面或半成品被 Google 收錄成薄內容頁——被收錄後要移除比不被
// 收錄麻煩得多。驗收通過、導覽列入口恢復時，這段要一併刪除。
export const metadata = {
  robots: { index: false, follow: false },
};

export default async function VideosPage() {
  const videos = await getPublishedVideos();

  return (
    <>
      <Header />
      <main className="bg-white">
        {/* Page Title */}
        <section className="pb-12 pt-12 text-center md:pb-28 md:pt-28 lg:pb-32 lg:pt-32 xl:pb-40 xl:pt-40">
          <h1 className="text-4xl font-bold tracking-[0.15em] text-[#1d2087] md:text-6xl md:font-black lg:text-8xl xl:text-9xl">
            TISCLLB
          </h1>
          <div className="mx-auto mt-4 inline-flex flex-col items-center">
            <h2 className="text-2xl font-bold tracking-[0.15em] text-[#1d2087] lg:text-3xl">
              影片
            </h2>
            <div className="mt-2 h-[2px] w-[160%] bg-[#1d2087]/40" />
          </div>
        </section>

        {/* Video Grid */}
        <section className="mx-auto max-w-7xl px-6 pb-16 md:px-12 md:pb-20 lg:px-16">
          {videos.length === 0 ? (
            <p className="text-center text-gray-500">目前沒有影片</p>
          ) : (
            <VideoGallery videos={videos} />
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
