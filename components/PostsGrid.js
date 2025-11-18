"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {posts.map((post) => (
        <motion.article
          key={post._id}
          variants={cardVariants}
          whileHover={{ y: -8, transition: { duration: 0.3 } }}
          className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-zinc-100"
        >
          {/* Image Container */}
          {post.mainImageUrl && (
            <div className="relative h-56 bg-gradient-to-br from-zinc-100 to-zinc-200 overflow-hidden">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-full h-full"
              >
                <Image
                  src={post.mainImageUrl}
                  alt={post.mainImageAlt || post.title}
                  fill
                  className="object-cover"
                />
              </motion.div>
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {/* Category & Date */}
            <div className="flex items-center justify-between mb-3">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-xs bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full font-semibold shadow-md"
              >
                {post.category?.name || "सामान्य"}
              </motion.span>
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
              className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold text-sm group/link"
            >
              <span>और पढ़ें</span>
              <motion.svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ x: [0, 5, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </motion.svg>
            </Link>
          </div>

          {/* Bottom Border Animation */}
          <motion.div
            className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.5 }}
            style={{ transformOrigin: "left" }}
          />
        </motion.article>
      ))}
    </motion.div>
  );
}
