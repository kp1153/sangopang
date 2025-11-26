import React from "react";
import { getAllPosts } from "@/lib/sanity";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function MagazineLayout() {
  const posts = await getAllPosts();

  if (!posts || posts.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">कोई पोस्ट उपलब्ध नहीं है।</p>
        </div>
      </div>
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

  // Category colors mapping (NEW CATEGORIES)
  const getCategoryColor = (categorySlug) => {
    const colors = {
      jaipur: "bg-red-500",
      "nagar-dagar": "bg-green-500",
      "duniya-jahan": "bg-orange-500",
      "jeevan-ke-rang": "bg-pink-500",
      "khel-sansar": "bg-purple-500",
      vividh: "bg-blue-500",
    };
    return colors[categorySlug] || "bg-blue-600";
  };

  // Featured post (pehli post)
  const featuredPost = posts[0];

  // Medium posts (next 3 posts)
  const mediumPosts = posts.slice(1, 4);

  // Popular posts (top 3 by views - agar views hai to)
  const popularPosts = [...posts]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 3);

  // Categories with count
  const categoriesCount = posts.reduce((acc, post) => {
    const catSlug = post.category?.slug?.current;
    if (catSlug) {
      acc[catSlug] = (acc[catSlug] || 0) + 1;
    }
    return acc;
  }, {});

  const categoriesData = Object.entries(categoriesCount).map(
    ([slug, count]) => {
      const names = {
        jaipur: "जयपुर",
        "nagar-dagar": "नगर-डगर",
        "duniya-jahan": "दुनिया-जहान",
        "jeevan-ke-rang": "जीवन के रंग",
        "khel-sansar": "खेल संसार",
        vividh: "विविध",
      };
      return { slug, name: names[slug] || slug, count };
    }
  );

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Featured Post (Big) */}
        {featuredPost && (
          <div className="mb-8">
            <article className="bg-white rounded-lg shadow-lg overflow-hidden">
              {featuredPost.mainImageUrl ? (
                <div className="h-96 relative bg-gray-100">
                  <Image
                    src={featuredPost.mainImageUrl}
                    alt={featuredPost.mainImageAlt || featuredPost.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="h-96 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              )}
              <div className="p-8">
                <span
                  className={`${getCategoryColor(
                    featuredPost.category?.slug?.current
                  )} text-white px-3 py-1 rounded text-sm`}
                >
                  {featuredPost.category?.name || "सामान्य"}
                </span>
                <h2 className="text-4xl font-bold mt-4 mb-3">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-600 text-lg mb-4">
                  {featuredPost.title}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {formatDate(featuredPost.publishedAt)}
                  </span>
                  <Link
                    href={`/${featuredPost.category?.slug?.current}/${featuredPost.slug?.current}`}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                  >
                    पढ़ें →
                  </Link>
                </div>
              </div>
            </article>
          </div>
        )}

        {/* Grid Section */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - 2/3 Posts */}
          <div className="md:col-span-2 space-y-6">
            {mediumPosts.map((post) => (
              <article
                key={post._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
              >
                <div className="flex gap-4">
                  {post.mainImageUrl ? (
                    <div className="w-48 h-32 relative rounded flex-shrink-0 bg-gray-100">
                      <Image
                        src={post.mainImageUrl}
                        alt={post.mainImageAlt || post.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  ) : (
                    <div className="w-48 h-32 bg-gradient-to-r from-green-400 to-blue-500 rounded flex-shrink-0"></div>
                  )}
                  <div className="flex-1">
                    <span
                      className={`${getCategoryColor(
                        post.category?.slug?.current
                      )} text-white px-2 py-1 rounded text-xs`}
                    >
                      {post.category?.name || "सामान्य"}
                    </span>
                    <h3 className="text-xl font-bold mt-2 mb-2">
                      <Link
                        href={`/${post.category?.slug?.current}/${post.slug?.current}`}
                        className="hover:text-blue-600"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {post.title}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatDate(post.publishedAt)}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Right Sidebar - 1/3 */}
          <div className="space-y-6">
            {/* Popular Posts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4 border-b pb-2">
                लोकप्रिय पोस्ट
              </h3>
              <div className="space-y-4">
                {popularPosts.map((post, index) => (
                  <div
                    key={post._id}
                    className={
                      index < popularPosts.length - 1 ? "border-b pb-3" : "pb-3"
                    }
                  >
                    <Link
                      href={`/${post.category?.slug?.current}/${post.slug?.current}`}
                    >
                      <h4 className="font-semibold text-sm mb-1 hover:text-blue-600">
                        {post.title}
                      </h4>
                    </Link>
                    <span className="text-xs text-gray-500">
                      {formatDate(post.publishedAt)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4 border-b pb-2">
                श्रेणियां
              </h3>
              <div className="space-y-2">
                {categoriesData.map((cat) => (
                  <div key={cat.slug} className="flex justify-between">
                    <Link
                      href={`/${cat.slug}`}
                      className="text-sm hover:text-blue-600"
                    >
                      {cat.name}
                    </Link>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                      {cat.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
