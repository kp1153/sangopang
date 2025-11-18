"use client";

import Image from "next/image";
import Link from "next/link";

export default function PostsGrid({ posts }) {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("hi-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <article
          key={post._id}
          className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-zinc-100 hover:-translate-y-2"
        >
          {/* Image Container */}
          {post.mainImageUrl && (
            <div className="relative h-56 bg-gradient-to-br from-zinc-100 to-zinc-200 overflow-hidden">
              <Image
                src={post.mainImageUrl}
                alt={post.mainImageAlt || post.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {/* Category & Date */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full font-semibold shadow-md">
                {post.category?.name || "सामान्य"}
              </span>
              <span className="text-xs text-zinc-500 font-medium">
                {formatDate(post.publishedAt)}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold mb-4 line-clamp-2 leading-tight text-zinc-900 group-hover:text-pink-600 transition-colors duration-300">
              <Link
                href={`/${post.category?.slug?.current}/${post.slug?.current}`}
              >
                {post.title}
              </Link>
            </h3>

            {/* Read More */}
            <Link
              href={`/${post.category?.slug?.current}/${post.slug?.current}`}
              className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold text-sm"
            >
              <span>और पढ़ें</span>
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

          {/* Bottom Border */}
          <div className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </article>
      ))}
    </div>
  );
}
