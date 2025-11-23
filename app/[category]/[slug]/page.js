import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPostBySlugAndCategory } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";

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

const getYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const portableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-4 text-gray-800 leading-relaxed text-base">{children}</p>
    ),
    h1: ({ children }) => (
      <h1 className="text-2xl font-bold mb-4 text-gray-900 mt-6">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl font-bold mb-3 text-gray-900 mt-5">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-bold mb-2 text-gray-900 mt-4">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-red-600 pl-4 italic text-gray-700 my-4 bg-gray-50 py-3">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc ml-6 mb-4 text-gray-800 space-y-1">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal ml-6 mb-4 text-gray-800 space-y-1">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="text-base leading-relaxed">{children}</li>
    ),
    number: ({ children }) => (
      <li className="text-base leading-relaxed">{children}</li>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-gray-900">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <span className="underline">{children}</span>,
    pink: ({ children }) => (
      <span className="text-pink-600 font-medium">{children}</span>
    ),
    link: ({ value, children }) => {
      const href = value?.href || "#";
      return (
        <a
          href={href}
          className="text-blue-600 hover:text-blue-800 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    cloudinaryImage: ({ value }) => {
      if (!value?.url) return null;
      return (
        <div className="my-6 flex flex-col items-center">
          <Image
            src={value.url}
            alt={value.caption || "Article image"}
            width={1200}
            height={800}
            className="object-contain max-h-[70vh] w-auto bg-gray-100"
          />
          {value.caption && (
            <p className="text-sm text-gray-600 text-center mt-2 italic w-full">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
    gallery: ({ value }) => (
      <div className="my-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        {value.images?.map((img, index) => (
          <div key={index} className="relative aspect-square">
            <Image
              src={img.url}
              alt={img.alt || `Gallery image ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    ),
    youtube: ({ value }) => {
      const videoId = getYouTubeId(value?.url);
      if (!videoId) return null;

      return (
        <div className="my-6">
          <div className="relative w-full pt-[56.25%] overflow-hidden">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {value.caption && (
            <p className="text-sm text-gray-600 text-center mt-2 italic">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
    videoEmbed: ({ value }) => {
      const videoId = getYouTubeId(value?.url);
      if (!videoId) return null;

      return (
        <div className="my-6">
          <div className="relative w-full pt-[56.25%] overflow-hidden">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="Video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {value.caption && (
            <p className="text-sm text-gray-600 text-center mt-2 italic">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
    video: ({ value }) => {
      const videoId = getYouTubeId(value?.url);
      if (!videoId) return null;

      return (
        <div className="my-6">
          <div className="relative w-full pt-[56.25%] overflow-hidden">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="Video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      );
    },
  },
};

export default async function NewsPage({ params }) {
  const { category, slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const post = await getPostBySlugAndCategory(decodedSlug, category);

  if (!post) {
    notFound();
  }

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("hi-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    });
  };

  const categoryDisplayName = getCategoryDisplayName(category);

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="bg-white">
              <div className="mb-4">
                <span className="inline-block bg-gray-900 text-white px-3 py-1 text-xs font-bold uppercase">
                  {categoryDisplayName}
                </span>
              </div>

              <h1 className="text-3xl font-bold mb-4 text-gray-900 leading-tight">
                {post.title}
              </h1>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                <span>{formatDate(post.publishedAt)}</span>
                <span>0</span>
              </div>

              {post.mainImageUrl && (
                <div className="w-full mb-6">
                  <Image
                    src={post.mainImageUrl}
                    alt={post.mainImageAlt || "Main image"}
                    width={800}
                    height={600}
                    className="object-cover w-full bg-gray-100"
                    priority
                  />
                </div>
              )}

              {post.mainImageCaption && (
                <p className="text-sm text-gray-600 mb-6 italic">
                  {post.mainImageCaption}
                </p>
              )}

              <div className="prose prose-base max-w-none">
                <PortableText
                  value={post.content}
                  components={portableTextComponents}
                />
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 bg-gray-900 text-white hover:bg-red-600 transition-colors font-semibold text-sm"
                >
                  होम पेज
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
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </Link>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-red-600">
                Popular
              </h3>
              <p className="text-sm text-gray-600">
                संबंधित समाचार जल्द आ रहे हैं...
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
