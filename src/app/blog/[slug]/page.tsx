type Params = Promise<{ slug: string }>;

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">文章：{slug}</h1>
    </main>
  );
}
