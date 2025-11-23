import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPostsByCategory } from "@/lib/sanity";

export const dynamic = "force-dynamic";

const getCategoryDisplayName = (route) => {
  const displayNames = {
    jaipur: "जयपुर",
    "nagar-dagar": "नगर-डगर",
    "duniya-jahan": "दुनिया-जहान",
    "jeevan-ke-rang": "जीवन के रंग",
    "khel-sansar": "खेल संसार",
    vividh: "विविध",
  };
  return displayNames[route] || route;
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const posts = await getPostsByCategory(category);

  const categoryDisplayName = getCategoryDisplayName(category);

  const heroPost = posts[0];
  const popularPosts = posts.slice(1, 5);
  const mainPosts = posts.slice(5);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          {categoryDisplayName}
        </h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Post */}
            {heroPost && (
              <article className="border border-gray-200 overflow-hidden">
                {heroPost.mainImage && (
                  <div className="relative h-80 bg-gray-100">
                    <Image
                      src={heroPost.mainImage}
                      alt={heroPost.mainImageAlt || heroPost.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                )}
                <div className="bg-white p-4">
                  <span className="inline-block bg-gray-900 text-white px-3 py-1 text-xs font-bold mb-3 uppercase">
                    {heroPost.category?.name}
                  </span>
                  <h2 className="text-2xl font-bold mb-3 leading-tight text-gray-900">
                    {heroPost.title}
                  </h2>
                  <Link
                    href={`/${heroPost.category?.slug?.current}/${heroPost.slug?.current}`}
                    className="inline-flex items-center text-red-600 hover:text-red-700 font-semibold text-sm"
                  >
                    और पढ़ें
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Link>
                </div>
              </article>
            )}

            {/* Main Posts Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {mainPosts.map((post) => (
                <article
                  key={post._id}
                  className="bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {post.mainImage && (
                    <div className="relative h-48 bg-gray-100">
                      <Image
                        src={post.mainImage}
                        alt={post.mainImageAlt || post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <span className="inline-block bg-gray-900 text-white px-2 py-1 text-xs font-bold mb-2 uppercase">
                      {post.category?.name}
                    </span>
                    <h3 className="font-bold text-base leading-tight mb-2 line-clamp-2 text-gray-900">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <span>{formatDate(post.publishedAt)}</span>
                      <span>0</span>
                    </div>
                    <Link
                      href={`/${post.category?.slug?.current}/${post.slug?.current}`}
                      className="inline-flex items-center text-red-600 hover:text-red-700 font-semibold text-sm"
                    >
                      और पढ़ें
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
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
                    {post.mainImage && (
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={post.mainImage}
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
          </div>
        </div>
      </div>
    </div>
  );
}
