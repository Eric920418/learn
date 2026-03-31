import Image from "next/image";
import Link from "next/link";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { getPublishedAlbumsWithCover } from "@/lib/queries/gallery";

export default async function GalleryPage() {
  const albums = await getPublishedAlbumsWithCover();

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
            活動錦集
          </h2>
          <div className="mt-2 h-[2px] w-[160%] bg-[#1d2087]/40" />
        </div>
      </section>

      {/* Album Grid */}
      <section className="mx-auto max-w-7xl px-6 pb-16 md:px-12 md:pb-20 lg:px-16">
        {albums.length === 0 ? (
          <p className="text-center text-gray-500">目前沒有活動相簿</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {albums.map((album) => {
              const coverSrc =
                album.coverImage ||
                album.photos[0]?.imageUrl ||
                null;

              return (
                <Link
                  key={album.id}
                  href={`/gallery/${album.id}`}
                  className="group block overflow-hidden rounded-lg bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Cover Image */}
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-[#1d2087] to-[#256f91]">
                    {coverSrc && (
                      <Image
                        src={coverSrc}
                        alt={album.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-[#1d2087]">
                      {album.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {album.eventDate}
                    </p>
                    {album.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                        {album.description}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
    <Footer />
    </>
  );
}
