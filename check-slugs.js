// check-slugs.js
const fetch = require("node-fetch");

const CONFIG = {
  sanityProject: "w7c95t9q",
  sanityDataset: "production",
  sanityToken:
    "skuJK9h0WIxdwhYw1luNlc8AgYKDFN4ot84Xv19iTcq0GXUWerJHgfHbmM7GaURL0IRKkVTm5ksa802ROmX9oMqN6eCm365ayPjZOwFfxRKtkXDpazw7XbMjAMcjTObyFh1yDq8RYCW3W46d3G2Bk5nrOTHoXId6Y32lq32j6jctQfSYfeuM",
};

async function checkEncodedSlugs() {
  console.log("🔍 Encoded slugs check कर रहे हैं...\n");

  try {
    // Fetch all posts
    const query = `*[_type == "post"]{_id, title, "slug": slug.current}`;
    const url = `https://${CONFIG.sanityProject}.api.sanity.io/v2021-10-21/data/query/${CONFIG.sanityDataset}?query=${encodeURIComponent(query)}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${CONFIG.sanityToken}`,
      },
    });

    const data = await response.json();
    const posts = data.result;

    console.log(`📊 कुल posts: ${posts.length}\n`);

    // Check for encoded slugs
    const encodedPosts = posts.filter((post) => {
      // अगर slug में % है तो वो encoded है
      return post.slug && post.slug.includes("%");
    });

    console.log(`❌ Encoded slugs वाली posts: ${encodedPosts.length}\n`);

    if (encodedPosts.length > 0) {
      console.log("📝 कुछ examples:\n");
      encodedPosts.slice(0, 5).forEach((post, i) => {
        console.log(`${i + 1}. Title: ${post.title}`);
        console.log(`   Slug: ${post.slug}`);
        console.log(`   Decoded: ${decodeURIComponent(post.slug)}\n`);
      });
    }

    console.log(`\n✅ ${posts.length - encodedPosts.length} posts सही हैं`);
    console.log(`🔧 ${encodedPosts.length} posts को fix करना होगा`);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

checkEncodedSlugs();
