import { notFound } from "next/navigation";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { getPostBySlug } from "@/lib/queries/blog";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <>
      <Header />
      <main className="bg-white">
        <article className="mx-auto max-w-3xl px-6 py-16 md:py-24">
          <h1 className="text-3xl font-black text-[#1d2087] mb-4 md:text-4xl">{post.title}</h1>
          <p className="text-sm text-gray-400 mb-8">{new Date(post.createdAt).toLocaleDateString("zh-TW")}</p>
          {post.content && (
            <div className="prose prose-lg max-w-none whitespace-pre-wrap text-foreground">
              {post.content}
            </div>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
