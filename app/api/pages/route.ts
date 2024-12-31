import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Page from "@/models/Page";
import { authOptions } from "../auth/[...nextauth]/route";
import { encrypt, decrypt } from "@/lib/encryption";
import User from "@/models/User";
import { Session } from "next-auth";

interface CustomSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

// Get all pages for the logged-in user
export async function GET() {
  try {
    console.log("GET /api/pages - Start");

    const session = (await getServerSession(authOptions)) as CustomSession;
    console.log("Session:", JSON.stringify(session, null, 2));

    if (!session?.user) {
      console.log("Unauthorized - No session or user");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    console.log("Database connected");

    const pages = await Page.find({ userId: session.user.id }).sort({
      updatedAt: -1,
    });
    console.log(`Found ${pages.length} pages for user`);

    const user = await User.findById(session.user.id);
    console.log("Found user:", user._id);

    console.log("Decrypting pages...");
    const decryptedPages = pages.map((page) => ({
      ...page.toObject(),
      content: page.content
        ? decrypt(page.content, user.encryptionKey)
        : page.content,
      title: page.title ? decrypt(page.title, user.encryptionKey) : page.title,
    }));
    console.log("Pages decrypted successfully");

    return NextResponse.json(decryptedPages);
  } catch (error) {
    console.error("GET /api/pages - Error:", error);
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

    const session = (await getServerSession(authOptions)) as CustomSession;
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

    const user = await User.findById(session.user.id);
    console.log("Found user:", user._id);

    console.log("Encrypting page data...");
    const pageData = {
      ...data,
      userId: userId,
      content: data.content ? encrypt(data.content, user.encryptionKey) : "",
      title: data.title ? encrypt(data.title, user.encryptionKey) : "",
    };
    console.log("Creating page with data:", pageData);

    const page = await Page.create(pageData);
    console.log("Page created successfully:", page._id);

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
