// fix-slugs.js
const fetch = require("node-fetch");

const CONFIG = {
  sanityProject: "w7c95t9q",
  sanityDataset: "production",
  sanityToken:
    "skuJK9h0WIxdwhYw1luNlc8AgYKDFN4ot84Xv19iTcq0GXUWerJHgfHbmM7GaURL0IRKkVTm5ksa802ROmX9oMqN6eCm365ayPjZOwFfxRKtkXDpazw7XbMjAMcjTObyFh1yDq8RYCW3W46d3G2Bk5nrOTHoXId6Y32lq32j6jctQfSYfeuM",
};

const stats = {
  total: 0,
  fixed: 0,
  skipped: 0,
  errors: 0,
};

function log(message, type = "info") {
  const timestamp = new Date().toLocaleTimeString("hi-IN");
  const colors = {
    info: "\x1b[36m",
    success: "\x1b[32m",
    error: "\x1b[31m",
    warning: "\x1b[33m",
  };
  const reset = "\x1b[0m";
  console.log(`${colors[type]}[${timestamp}] ${message}${reset}`);
}

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

async function fixEncodedSlugs() {
  log("🚀 Slug fix शुरू हो रही है...", "info");

  try {
    // Fetch all posts with encoded slugs
    const query = `*[_type == "post"]{_id, title, "slug": slug.current}`;
    const url = `https://${CONFIG.sanityProject}.api.sanity.io/v2021-10-21/data/query/${CONFIG.sanityDataset}?query=${encodeURIComponent(query)}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${CONFIG.sanityToken}`,
      },
    });

    const data = await response.json();
    const posts = data.result;

    // Filter encoded slugs only
    const encodedPosts = posts.filter((post) => {
      return post.slug && post.slug.includes("%");
    });

    stats.total = encodedPosts.length;
    log(`📊 कुल ${stats.total} posts को fix करना है`, "info");

    // Process each post
    for (let i = 0; i < encodedPosts.length; i++) {
      const post = encodedPosts[i];

      try {
        log(`🔄 [${i + 1}/${stats.total}] Processing: ${post.title}`, "info");

        // Decode slug
        const decodedSlug = decodeURIComponent(post.slug);

        // Update in Sanity
        await uploadToSanity([
          {
            patch: {
              id: post._id,
              set: {
                slug: {
                  _type: "slug",
                  current: decodedSlug,
                },
              },
            },
          },
        ]);

        stats.fixed++;
        log(`✅ Fixed: ${post.title} → ${decodedSlug}`, "success");

        // Delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (error) {
        stats.errors++;
        log(`❌ Error: ${post.title} - ${error.message}`, "error");
      }
    }

    log("\n🎉 Slug fix पूरी हो गई!", "success");
    log(`📊 Stats: ${stats.fixed} fixed, ${stats.errors} errors`, "info");
  } catch (error) {
    log(`❌ Fix failed: ${error.message}`, "error");
  }
}

fixEncodedSlugs();
