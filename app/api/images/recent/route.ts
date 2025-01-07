import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Page from "@/models/Page";
import connectDB from "@/lib/mongodb";

export async function GET() {
  try {
    // Get the current user's session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Fetch distinct cover images from user's pages
    const recentImages = await Page.aggregate([
      // Match documents for this user with cover images
      {
        $match: {
          userId: session.user.id,
          cover: { $exists: true, $ne: null },
        },
      },
      // Group by cover URL to get unique covers
      {
        $group: {
          _id: "$cover",
          lastUpdated: { $max: "$updatedAt" }, // Keep track of most recent usage
        },
      },
      // Sort by most recently used
      {
        $sort: { lastUpdated: -1 },
      },
      // Project to get just the cover URL
      {
        $project: {
          _id: 0,
          cover: "$_id",
        },
      },
    ]);

    const images = recentImages.map((item) => item.cover);

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error fetching recent images:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent images" },
      { status: 500 }
    );
  }
}
