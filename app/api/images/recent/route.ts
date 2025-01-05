import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    console.log("Fetching recent images...");
    const result = await cloudinary.search
      .expression("folder:note-app")
      .sort_by("created_at", "desc")
      .max_results(5)
      .execute();

    console.log("Search result:", result);

    const images = result.resources.map(
      (resource: { secure_url: string }) => resource.secure_url
    );

    console.log("Processed images:", images);
    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error fetching recent images:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent images", details: error.message },
      { status: 500 }
    );
  }
}
