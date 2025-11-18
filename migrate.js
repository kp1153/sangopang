// migrate.js
// Project की root directory में save करें और run करें: node migrate.js

const fetch = require("node-fetch");
const fs = require("fs");

// ⚙️ Configuration
const CONFIG = {
  wpUrl: "https://sangopang.com",
  sanityProject: "w7c95t9q",
  sanityDataset: "production",
  sanityToken:
    "skuJK9h0WIxdwhYw1luNlc8AgYKDFN4ot84Xv19iTcq0GXUWerJHgfHbmM7GaURL0IRKkVTm5ksa802ROmX9oMqN6eCm365ayPjZOwFfxRKtkXDpazw7XbMjAMcjTObyFh1yDq8RYCW3W46d3G2Bk5nrOTHoXId6Y32lq32j6jctQfSYfeuM",
  cloudinaryCloud: "dqsdqx93m",
  cloudinaryPreset: "sangopang",
};

// 📊 Stats
const stats = {
  total: 0,
  processed: 0,
  images: 0,
  errors: 0,
  logs: [],
};

// 📝 Logging function
function log(message, type = "info") {
  const timestamp = new Date().toLocaleTimeString("hi-IN");
  const colors = {
    info: "\x1b[36m", // Cyan
    success: "\x1b[32m", // Green
    error: "\x1b[31m", // Red
    warning: "\x1b[33m", // Yellow
  };
  const reset = "\x1b[0m";

  console.log(`${colors[type]}[${timestamp}] ${message}${reset}`);
  stats.logs.push({ timestamp, message, type });
}

// 🔄 HTML to Portable Text converter
function htmlToPortableText(html) {
  // Simple regex-based converter for Node.js
  const blocks = [];

  // Remove script and style tags
  html = html.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );
  html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

  // Extract paragraphs
  const paragraphs = html.match(/<p[^>]*>(.*?)<\/p>/gi) || [];

  paragraphs.forEach((p) => {
    const text = p.replace(/<[^>]+>/g, "").trim();
    if (text) {
      blocks.push({
        _type: "block",
        _key: Math.random().toString(36).substr(2, 9),
        style: "normal",
        children: [
          {
            _type: "span",
            _key: Math.random().toString(36).substr(2, 9),
            text: text,
            marks: [],
          },
        ],
        markDefs: [],
      });
    }
  });

  // Extract headings
  const headings = html.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi) || [];

  headings.forEach((h) => {
    const level = h.match(/h([1-6])/i)?.[1] || "2";
    const text = h.replace(/<[^>]+>/g, "").trim();
    if (text) {
      blocks.push({
        _type: "block",
        _key: Math.random().toString(36).substr(2, 9),
        style: `h${level}`,
        children: [
          {
            _type: "span",
            _key: Math.random().toString(36).substr(2, 9),
            text: text,
            marks: [],
          },
        ],
        markDefs: [],
      });
    }
  });

  // Extract images
  const images = html.match(/<img[^>]+>/gi) || [];

  images.forEach((img) => {
    const src = img.match(/src=["']([^"']+)["']/i)?.[1];
    const alt = img.match(/alt=["']([^"']+)["']/i)?.[1] || "";

    if (src) {
      blocks.push({
        _type: "cloudinaryImage",
        _key: Math.random().toString(36).substr(2, 9),
        url: src,
        alt: alt,
        caption: alt,
      });
    }
  });

  return blocks.length > 0
    ? blocks
    : [
        {
          _type: "block",
          _key: Math.random().toString(36).substr(2, 9),
          style: "normal",
          children: [
            {
              _type: "span",
              _key: Math.random().toString(36).substr(2, 9),
              text: html.replace(/<[^>]+>/g, "").trim(),
              marks: [],
            },
          ],
          markDefs: [],
        },
      ];
}

// 📤 Upload to Cloudinary
async function uploadToCloudinary(imageUrl) {
  try {
    const FormData = require("form-data");
    const form = new FormData();

    form.append("file", imageUrl);
    form.append("upload_preset", CONFIG.cloudinaryPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CONFIG.cloudinaryCloud}/image/upload`,
      { method: "POST", body: form }
    );

    if (!response.ok) throw new Error("Upload failed");

    const data = await response.json();
    stats.images++;
    return data.secure_url;
  } catch (error) {
    log(`Image upload failed: ${imageUrl}`, "warning");
    return imageUrl;
  }
}

// 📥 Fetch all WordPress posts
async function fetchAllPosts() {
  let allPosts = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    try {
      const response = await fetch(
        `${CONFIG.wpUrl}/wp-json/wp/v2/posts?per_page=100&page=${page}&_embed`
      );

      if (!response.ok) break;

      const posts = await response.json();

      if (posts.length === 0) {
        hasMore = false;
      } else {
        allPosts = allPosts.concat(posts);
        log(`Page ${page} fetched: ${posts.length} posts`, "success");
        page++;
      }
    } catch (error) {
      log(`Error fetching page ${page}: ${error.message}`, "error");
      hasMore = false;
    }
  }

  return allPosts;
}

// 📤 Upload to Sanity
async function uploadToSanity(mutations) {
  const url = `https://${CONFIG.sanityProject}.api.sanity.io/v1/data/mutate/${CONFIG.sanityDataset}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CONFIG.sanityToken}`,
    },
    body: JSON.stringify({ mutations }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Sanity upload failed: ${error}`);
  }

  return await response.json();
}

// 🚀 Main migration function
async function startMigration() {
  log("🚀 Migration शुरू हो रही है...", "info");

  try {
    // Step 1: Create category
    log("📁 Category बना रहे हैं...", "info");

    try {
      await uploadToSanity([
        {
          create: {
            _type: "category",
            _id: "category-duniya-jahan",
            name: "दुनिया-जहान",
            slug: { _type: "slug", current: "duniya-jahan" },
          },
        },
      ]);
      log("✅ Category बन गई", "success");
    } catch (error) {
      if (error.message.includes("already exists")) {
        log("ℹ️ Category पहले से मौजूद है", "info");
      } else {
        throw error;
      }
    }

    // Step 2: Fetch posts
    log("📥 WordPress से posts fetch कर रहे हैं...", "info");
    const posts = await fetchAllPosts();
    stats.total = posts.length;
    log(`✅ कुल ${posts.length} posts मिले`, "success");

    // Step 3: Process each post
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];

      try {
        log(
          `🔄 [${i + 1}/${posts.length}] Processing: ${post.title.rendered}`,
          "info"
        );

        // Featured image
        let mainImageUrl = null;
        if (post._embedded?.["wp:featuredmedia"]?.[0]?.source_url) {
          const wpImageUrl = post._embedded["wp:featuredmedia"][0].source_url;
          mainImageUrl = await uploadToCloudinary(wpImageUrl);
        }

        // Convert content
        const content = htmlToPortableText(post.content.rendered);

        // Upload content images
        for (let block of content) {
          if (
            block._type === "cloudinaryImage" &&
            block.url &&
            block.url.startsWith("http")
          ) {
            block.url = await uploadToCloudinary(block.url);
          }
        }

        // Create Sanity document
        const sanityDoc = {
          _type: "post",
          _id: `post-${post.id}`,
          title: post.title.rendered,
          slug: { _type: "slug", current: post.slug },
          publishedAt: post.date,
          category: { _type: "reference", _ref: "category-duniya-jahan" },
          content: content,
        };

        if (mainImageUrl) {
          sanityDoc.mainImage = {
            _type: "cloudinaryImage",
            url: mainImageUrl,
            alt: post.title.rendered,
          };
        }

        // Upload to Sanity
        await uploadToSanity([{ createOrReplace: sanityDoc }]);

        stats.processed++;
        log(`✅ Upload हो गया: ${post.title.rendered}`, "success");
      } catch (error) {
        stats.errors++;
        log(`❌ Error: ${post.title.rendered} - ${error.message}`, "error");
      }

      // Delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    log("🎉 Migration पूरी हो गई!", "success");
    log(
      `📊 Stats: ${stats.processed}/${stats.total} posts uploaded, ${stats.images} images, ${stats.errors} errors`,
      "info"
    );

    // Save log
    fs.writeFileSync(
      `migration-log-${Date.now()}.json`,
      JSON.stringify(stats.logs, null, 2)
    );
    log("📥 Log file saved", "success");
  } catch (error) {
    log(`❌ Migration failed: ${error.message}`, "error");
    stats.errors++;
  }
}

// Run migration
startMigration();
