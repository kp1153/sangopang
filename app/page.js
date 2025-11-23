import Image from "next/image";
import Link from "next/link";
import { createClient } from "@sanity/client";

export const dynamic = "force-dynamic";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
});

async function getCategoryPosts(categorySlug, limit = 6) {
  return await client.fetch(
    `
    *[_type == "post" && category->slug.current == $slug] | order(publishedAt desc)[0...${limit}] {
      _id,
      title,
      slug,
      mainImageUrl,
      mainImageAlt,
      publishedAt,
      category->{name, slug}
    }
  `,
    { slug: categorySlug }
  );
}

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default async function HomePage() {
  const jaipurPosts = await getCategoryPosts("jaipur", 6);
  const nagarPosts = await getCategoryPosts("nagar-dagar", 6);
  const duniyaPosts = await getCategoryPosts("duniya-jahan", 6);
  const photoPosts = await getCategoryPosts("jeevan-ke-rang", 6);
  const khelPosts = await getCategoryPosts("khel-sansar", 6);
  const vividhPosts = await getCategoryPosts("vividh", 6);

  const allPosts = [
    ...jaipurPosts,
    ...nagarPosts,
    ...duniyaPosts,
    ...photoPosts,
    ...khelPosts,
    ...vividhPosts,
  ];
  const latestPosts = allPosts
    .filter((post) => post.mainImageUrl)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, 20);

  const heroPost = latestPosts[0];
  const popularPosts = latestPosts.slice(1, 5);
  const mainNewsPosts = latestPosts.slice(5, 9);
  const featuredPosts = latestPosts.slice(9, 12);
  const relatedPosts = latestPosts.slice(12, 15);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Post */}
            {heroPost && heroPost.mainImageUrl && (
              <article className="relative h-96 overflow-hidden">
                <Image
                  src={heroPost.mainImageUrl}
                  alt={heroPost.mainImageAlt || heroPost.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <span className="inline-block bg-gray-900 text-white px-3 py-1 text-xs font-bold mb-3 uppercase">
                    {heroPost.category?.name}
                  </span>
                  <h1 className="text-3xl font-bold mb-2 leading-tight">
                    <Link
                      href={`/${heroPost.category?.slug?.current}/${heroPost.slug?.current}`}
                      className="hover:text-red-400 transition-colors"
                    >
                      {heroPost.title}
                    </Link>
                  </h1>
                </div>
              </article>
            )}

            {/* Latest News Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Latest News</h2>
                <Link
                  href="/all"
                  className="text-xs text-red-600 hover:underline font-semibold"
                >
                  SEE ALL
                </Link>
              </div>
              <div className="space-y-4">
                {mainNewsPosts.map((post) => (
                  <article
                    key={post._id}
                    className="flex gap-4 border-b border-gray-200 pb-4"
                  >
                    {post.mainImageUrl && (
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <Image
                          src={post.mainImageUrl}
                          alt={post.mainImageAlt || post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <span className="inline-block bg-gray-900 text-white px-2 py-1 text-xs font-bold mb-2 uppercase">
                        {post.category?.name}
                      </span>
                      <h3 className="font-bold text-sm leading-tight mb-1 line-clamp-2 hover:text-red-600 transition-colors">
                        <Link
                          href={`/${post.category?.slug?.current}/${post.slug?.current}`}
                        >
                          {post.title}
                        </Link>
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                        <span>{formatDate(post.publishedAt)}</span>
                        <span>0</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Featured Section */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Featured</h2>
              <div className="space-y-4">
                {featuredPosts.map((post) => (
                  <article
                    key={post._id}
                    className="border-b border-gray-200 pb-4"
                  >
                    <span className="inline-block bg-gray-900 text-white px-2 py-1 text-xs font-bold mb-2 uppercase">
                      {post.category?.name}
                    </span>
                    <h3 className="font-bold text-base leading-tight mb-2 hover:text-red-600 transition-colors">
                      <Link
                        href={`/${post.category?.slug?.current}/${post.slug?.current}`}
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{formatDate(post.publishedAt)}</span>
                      <span>0</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Popular Posts */}
            <div className="bg-gray-50 p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-red-600">
                Popular
              </h3>
              <div className="space-y-4">
                {popularPosts.map((post) => (
                  <article key={post._id} className="flex gap-3">
                    {post.mainImageUrl && (
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={post.mainImageUrl}
                          alt={post.mainImageAlt || post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <span className="inline-block bg-gray-900 text-white px-2 py-1 text-xs font-bold mb-1 uppercase">
                        {post.category?.name}
                      </span>
                      <h4 className="font-bold text-xs leading-tight line-clamp-2 hover:text-red-600 transition-colors">
                        <Link
                          href={`/${post.category?.slug?.current}/${post.slug?.current}`}
                        >
                          {post.title}
                        </Link>
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span>{formatDate(post.publishedAt)}</span>
                        <span>0</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Related Posts */}
            <div className="bg-gray-900 text-white p-4">
              <h3 className="text-lg font-bold mb-4 pb-2 border-b-2 border-red-600">
                Related
              </h3>
              <div className="space-y-4">
                {relatedPosts.map((post) => (
                  <article key={post._id}>
                    {post.mainImageUrl && (
                      <div className="relative w-full h-32 mb-2">
                        <Image
                          src={post.mainImageUrl}
                          alt={post.mainImageAlt || post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <h4 className="font-bold text-sm leading-tight mb-2 hover:text-red-400 transition-colors">
                      <Link
                        href={`/${post.category?.slug?.current}/${post.slug?.current}`}
                      >
                        {post.title}
                      </Link>
                    </h4>
                    <div className="text-xs text-gray-400">
                      {formatDate(post.publishedAt)}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
