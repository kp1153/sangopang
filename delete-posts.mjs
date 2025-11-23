import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "w7c95t9q",
  dataset: "production",
  token:
    "skuJK9h0WIxdwhYw1luNlc8AgYKDFN4ot84Xv19iTcq0GXUWerJHgfHbmM7GaURL0IRKkVTm5ksa802ROmX9oMqN6eCm365ayPjZOwFfxRKtkXDpazw7XbMjAMcjTObyFh1yDq8RYCW3W46d3G2Bk5nrOTHoXId6Y32lq32j6jctQfSYfeuM",
  apiVersion: "2024-01-01",
  useCdn: false,
});

async function deleteAllPosts() {
  try {
    const ids = await client.fetch(`*[_type == "post"]._id`);
    console.log(`Found ${ids.length} posts to delete`);

    for (const id of ids) {
      await client.delete(id);
      console.log(`✓ Deleted: ${id}`);
    }

    console.log("✅ All posts deleted successfully!");
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

deleteAllPosts();
