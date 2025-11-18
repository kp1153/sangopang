import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@sanity/client";

const resend = new Resend(process.env.RESEND_API_KEY);

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: "2024-01-01",
});

export async function POST(request) {
  try {
    const { postSlug, categorySlug } = await request.json();

    if (!postSlug || !categorySlug) {
      return NextResponse.json(
        { error: "Post slug and category slug required" },
        { status: 400 }
      );
    }

    // Get post details
    const post = await client.fetch(
      `*[_type == "post" && slug.current == $postSlug][0]{
        title,
        "category": category->name
      }`,
      { postSlug }
    );

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Get all active subscribers
    const subscribers = await client.fetch(
      `*[_type == "subscriber" && isActive == true]{email}`
    );

    if (subscribers.length === 0) {
      return NextResponse.json({ message: "No subscribers found" });
    }

    const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://hamaramorcha.com"}/${categorySlug}/${postSlug}`;

    // Send emails
    const emailPromises = subscribers.map((sub) =>
      resend.emails.send({
        from: "Hamara Morcha <noreply@hamaramorcha.com>",
        to: sub.email,
        subject: `नई खबर: ${post.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #006680;">हमारा मोर्चा पर नई खबर!</h2>
            <h3 style="color: #333;">${post.title}</h3>
            <p style="color: #666;">श्रेणी: ${post.category}</p>
            <a href="${postUrl}" style="display: inline-block; background: #006680; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px;">खबर पढ़ें</a>
            <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;">
            <p style="color: #999; font-size: 12px;">यह email आपको इसलिए मिला क्योंकि आपने हमारा मोर्चा को subscribe किया है।</p>
          </div>
        `,
      })
    );

    await Promise.all(emailPromises);

    return NextResponse.json({
      success: true,
      sent: subscribers.length,
    });
  } catch (error) {
    console.error("Send newsletter error:", error);
    return NextResponse.json(
      { error: "Failed to send emails" },
      { status: 500 }
    );
  }
}
