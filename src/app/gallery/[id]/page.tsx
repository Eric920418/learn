import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { getAlbumWithPhotos } from "@/lib/queries/gallery";
import { AlbumMediaGrid } from "@/components/ui/AlbumMediaGrid";

export const dynamic = "force-dynamic";

export default async function AlbumDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const album = await getAlbumWithPhotos(id);

  if (!album || !album.published) notFound();

  return (
    <>
    <Header />
    <main className="bg-white">
      {/* Page Title */}
      <section className="pb-12 pt-12 text-center md:pb-20 md:pt-20 lg:pb-24 lg:pt-24">
        <h1 className="text-4xl font-bold tracking-[0.15em] text-[#1d2087] md:text-6xl md:font-black lg:text-8xl xl:text-9xl">
          TISCLLB
        </h1>
        <div className="mx-auto mt-4 inline-flex flex-col items-center">
          <h2 className="text-2xl font-bold tracking-[0.15em] text-[#1d2087] lg:text-3xl">
            {album.title}
          </h2>
          <div className="mt-2 h-[2px] w-[160%] bg-[#1d2087]/40" />
        </div>
        <p className="mt-4 text-gray-500">{album.eventDate}</p>
        {album.description && (
          <p className="mx-auto mt-2 max-w-2xl text-gray-600">
            {album.description}
          </p>
        )}
      </section>

      {/* Masonry Media Grid（照片 + 影片混合，依 sortOrder 排列） */}
      <section className="mx-auto max-w-7xl px-6 pb-16 md:px-12 md:pb-20 lg:px-16">
        {album.photos.length === 0 ? (
          <p className="text-center text-gray-500">此相簿尚無內容</p>
        ) : (
          <AlbumMediaGrid items={album.photos} albumTitle={album.title} />
        )}
      </section>

      {/* Back Link */}
      <section className="mx-auto max-w-7xl px-6 pb-16 text-center md:px-12">
        <Link
          href="/gallery"
          className="inline-block rounded-md px-6 py-2 text-sm text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: "var(--primary-navy)" }}
        >
          ← 返回活動錦集
        </Link>
      </section>
    </main>
    <Footer />
    </>
  );
}
