import Link from "next/link";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { getPublishedPosts } from "@/lib/queries/blog";

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="pb-12 pt-12 text-center md:pb-28 md:pt-28 lg:pb-32 lg:pt-32 xl:pb-40 xl:pt-40">
          <h1 className="text-4xl font-bold md:font-black tracking-[0.15em] text-[#1d2087] md:text-6xl lg:text-8xl xl:text-9xl">
            TISCLLB
          </h1>
          <div className="mx-auto mt-4 inline-flex flex-col items-center">
            <h2 className="text-2xl font-bold tracking-[0.15em] text-[#1d2087] lg:text-3xl">
              Blog
            </h2>
            <div className="mt-2 h-[2px] w-[160%] bg-[#1d2087]/40" />
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 pb-16 md:px-12 md:pb-20">
          <div className="space-y-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="block border rounded-lg p-6 hover:border-blue-300 hover:shadow-sm transition-all">
                <h3 className="text-xl font-bold text-[#1d2087] mb-2">{post.title}</h3>
                {post.excerpt && <p className="text-sm text-gray-600 mb-2">{post.excerpt}</p>}
                <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString("zh-TW")}</p>
              </Link>
            ))}
            {posts.length === 0 && (
              <p className="text-center text-gray-500 py-12">尚無文章</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
