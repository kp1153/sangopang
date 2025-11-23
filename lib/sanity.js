// lib/sanity.js

import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2023-05-03",
  useCdn: false,
});

const builder = imageUrlBuilder(client);

function getImageUrl(mainImage) {
  if (!mainImage) return null;

  if (typeof mainImage === "string" && mainImage.startsWith("http")) {
    return mainImage;
  }

  if (mainImage.asset) {
    return builder.image(mainImage).width(600).url();
  }

  return null;
}

export async function getAllPosts() {
  try {
    const posts = await client.fetch(`
      *[_type == "post"] | order(publishedAt desc) {
        _id,
        title,
        slug,
        mainImage,
        mainImageCaption,
        publishedAt,
        category->{ name, slug },
        content,
        videoLink,
        "excerpt": pt::text(content)[0...200]
      }
    `);

    return posts.map((post) => ({
      ...post,
      mainImageUrl: getImageUrl(post.mainImage),
      mainImageAlt: post.mainImageCaption || post.title,
    }));
  } catch (error) {
    console.error("Error fetching all posts:", error);
    return [];
  }
}

export async function getPostsByCategory(categorySlug) {
  try {
    const posts = await client.fetch(
      `
      *[_type == "post" && category->slug.current == $categorySlug] 
        | order(publishedAt desc) {
          _id,
          title,
          slug,
          mainImage,
          mainImageCaption,
          publishedAt,
          category->{ name, slug },
          content,
          videoLink,
          "excerpt": pt::text(content)[0...200]
        }
      `,
      { categorySlug }
    );

    return posts.map((post) => ({
      ...post,
      mainImageUrl: getImageUrl(post.mainImage),
      mainImageAlt: post.mainImageCaption || post.title,
    }));
  } catch (error) {
    console.error("Error fetching posts by category:", error);
    return [];
  }
}

export async function getPostBySlugAndCategory(slug, categorySlug) {
  try {
    const post = await client.fetch(
      `
      *[_type == "post" && slug.current == $slug && category->slug.current == $categorySlug][0] {
        _id,
        title,
        "slug": slug.current,
        mainImage,
        mainImageCaption,
        content,
        publishedAt,
        views,
        videoLink,
        "category": {
          "name": category->name,
          "slug": category->slug.current
        }
      }
      `,
      { slug, categorySlug }
    );

    if (!post) return null;

    return {
      ...post,
      mainImageUrl: getImageUrl(post.mainImage),
      mainImageAlt: post.mainImageCaption || post.title,
    };
  } catch (error) {
    console.error("Error fetching post by slug and category:", error);
    return null;
  }
}

export async function getPostBySlugOnly(slug) {
  try {
    const post = await client.fetch(
      `
      *[_type == "post" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        category->{
          name,
          slug
        }
      }
      `,
      { slug }
    );

    return post;
  } catch (error) {
    console.error("Error fetching post by slug only:", error);
    return null;
  }
}

export async function getCategories() {
  try {
    return await client.fetch(`
      *[_type == "category"] | order(name asc) {
        _id,
        name,
        slug
      }
    `);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getRecentPosts(limit = 5) {
  try {
    const posts = await client.fetch(`
      *[_type == "post"] | order(publishedAt desc)[0...${limit}] {
        _id,
        title,
        slug,
        mainImage,
        mainImageCaption,
        publishedAt,
        category->{ name, slug },
        videoLink,
        "excerpt": pt::text(content)[0...150]
      }
    `);

    return posts.map((post) => ({
      ...post,
      mainImageUrl: getImageUrl(post.mainImage),
      mainImageAlt: post.mainImageCaption || post.title,
    }));
  } catch (error) {
    console.error("Error fetching recent posts:", error);
    return [];
  }
}
