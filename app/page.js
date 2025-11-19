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
  const photoPosts = await getCategoryPosts("photo-feature", 6);
  const khelPosts = await getCategoryPosts("khel-sansar", 6);
  const vividhPosts = await getCategoryPosts("vividh", 6);

  const categories = [
    {
      name: "जयपुर",
      slug: "jaipur",
      posts: jaipurPosts,
      color: "from-pink-500 to-rose-500",
    },
    {
      name: "नगर-डगर",
      slug: "nagar-dagar",
      posts: nagarPosts,
      color: "from-purple-500 to-indigo-500",
    },
    {
      name: "दुनिया-जहान",
      slug: "duniya-jahan",
      posts: duniyaPosts,
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "फोटो फीचर",
      slug: "photo-feature",
      posts: photoPosts,
      color: "from-orange-500 to-red-500",
    },
    {
      name: "खेल संसार",
      slug: "khel-sansar",
      posts: khelPosts,
      color: "from-green-500 to-emerald-500",
    },
    {
      name: "विविध",
      slug: "vividh",
      posts: vividhPosts,
      color: "from-teal-500 to-blue-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {duniyaPosts[0] && (
        <section className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                  ताजा खबर
                </span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  <Link
                    href={`/${duniyaPosts[0].category?.slug?.current}/${duniyaPosts[0].slug?.current}`}
                    className="hover:text-pink-400 transition"
                  >
                    {duniyaPosts[0].title}
                  </Link>
                </h1>
                <p className="text-gray-300 text-lg">
                  {formatDate(duniyaPosts[0].publishedAt)}
                </p>
                <Link
                  href={`/${duniyaPosts[0].category?.slug?.current}/${duniyaPosts[0].slug?.current}`}
                  className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 px-6 py-3 rounded-full font-semibold transition"
                >
                  पूरी खबर पढ़ें
                  <svg
                    className="w-5 h-5"
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
              {duniyaPosts[0].mainImageUrl && (
                <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={duniyaPosts[0].mainImageUrl}
                    alt={duniyaPosts[0].mainImageAlt || duniyaPosts[0].title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {categories.map(
          (category) =>
            category.posts.length > 0 && (
              <section key={category.slug} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2
                    className={`text-3xl font-bold bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}
                  >
                    {category.name}
                  </h2>
                  <Link
                    href={`/${category.slug}`}
                    className="text-pink-600 hover:text-pink-700 font-semibold flex items-center gap-2 group"
                  >
                    सभी देखें
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition"
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

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.posts.map((post) => (
                    <article
                      key={post._id}
                      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                    >
                      {post.mainImageUrl && (
                        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                          <Image
                            src={post.mainImageUrl}
                            alt={post.mainImageAlt || post.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      )}

                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span
                            className={`bg-gradient-to-r ${category.color} text-white px-3 py-1 rounded-full font-semibold`}
                          >
                            {category.name}
                          </span>
                          <span>{formatDate(post.publishedAt)}</span>
                        </div>

                        <h3 className="text-lg font-bold line-clamp-2 leading-tight text-gray-900 group-hover:text-pink-600 transition">
                          <Link
                            href={`/${post.category?.slug?.current}/${post.slug?.current}`}
                          >
                            {post.title}
                          </Link>
                        </h3>

                        <Link
                          href={`/${post.category?.slug?.current}/${post.slug?.current}`}
                          className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold text-sm"
                        >
                          और पढ़ें
                          <svg
                            className="w-4 h-4"
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

                      <div
                        className={`h-1 bg-gradient-to-r ${category.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
                      />
                    </article>
                  ))}
                </div>
              </section>
            )
        )}
      </div>
    </div>
  );
}
