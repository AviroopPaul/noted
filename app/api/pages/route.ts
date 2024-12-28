import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Page from "@/models/Page";
import { authOptions } from "../auth/[...nextauth]/route";

// Get all pages for the logged-in user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const pages = await Page.find({ userId: session.user.id }).sort({
      updatedAt: -1,
    });

    return NextResponse.json(pages);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Create a new page
export async function POST(request: Request) {
  try {
    console.log("POST /api/pages - Start");

    const session = await getServerSession(authOptions);
    console.log("Full session object:", JSON.stringify(session, null, 2));
    console.log("Session user:", session?.user);
    console.log("Session user id:", session?.user?.id);

    if (!session?.user) {
      console.log("Unauthorized - No session or user");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    if (!userId) {
      console.error("No user ID found in session:", session.user);
      return NextResponse.json(
        { error: "User ID not found in session" },
        { status: 400 }
      );
    }

    const data = await request.json();
    console.log("Request data:", data);

    await connectDB();
    console.log("Database connected");

    const pageData = {
      ...data,
      userId: userId,
    };
    console.log("Creating page with data:", pageData);

    const page = await Page.create(pageData);
    console.log("Page created:", page);

    return NextResponse.json(page);
  } catch (error) {
    console.error("POST /api/pages - Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
