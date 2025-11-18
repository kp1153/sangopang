import { getAllPosts } from "@/lib/sanity";
import PostsGrid from "@/components/PostsGrid";

export const dynamic = "force-dynamic";

export default async function Page() {
  const posts = await getAllPosts();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <PostsGrid posts={posts || []} />
    </div>
  );
}
