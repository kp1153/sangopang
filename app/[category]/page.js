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
    "photo-feature": "फोटो फीचर",
    "khel-sansar": "खेल संसार",
    english: "Sangopang English",
  };
  return displayNames[route] || route;
};

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const posts = await getPostsByCategory(category);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("hi-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const categoryDisplayName = getCategoryDisplayName(category);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">
        {categoryDisplayName}
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-max">
        {posts.map((post) => (
          <article
            key={post._id}
            className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
          >
            {post.mainImageUrl && (
              <div className="relative w-full bg-gray-100 flex items-center justify-center min-h-[250px]">
                <Image
                  src={post.mainImageUrl}
                  alt={post.mainImageAlt}
                  width={600}
                  height={400}
                  className="object-contain w-full h-auto max-h-[400px]"
                />
              </div>
            )}

            <div className="p-6 flex flex-col flex-grow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-semibold">
                  {post.category?.name || "सामान्य"}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {formatDate(post.publishedAt)}
                </span>
              </div>

              <h2 className="text-xl font-bold mb-4 line-clamp-2 leading-tight text-gray-900 hover:text-blue-700 transition-colors">
                <Link
                  href={`/${post.category?.slug?.current}/${post.slug?.current}`}
                  className="hover:underline"
                >
                  {post.title}
                </Link>
              </h2>

              <div className="mt-auto">
                {post.category?.slug?.current && post.slug?.current && (
                  <Link
                    href={`/${post.category.slug.current}/${post.slug.current}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm hover:underline transition-colors"
                  >
                    और पढ़ें
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
