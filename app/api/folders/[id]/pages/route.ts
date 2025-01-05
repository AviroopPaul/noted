import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Folder from "@/models/Folder";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { CustomSession } from "@/types";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = (await getServerSession(authOptions)) as CustomSession;
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pageId } = await request.json();
    const folderId = params.id;

    await connectDB();

    // Verify folder belongs to user
    const folder = await Folder.findOne({
      _id: folderId,
      userId: session.user.id,
    });

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    // Add page to folder if not already present
    if (!folder.pageIds.includes(pageId)) {
      folder.pageIds.push(pageId);
      await folder.save();
    }

    return NextResponse.json(folder);
  } catch (error) {
    console.error("Error adding page to folder:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = (await getServerSession(authOptions)) as CustomSession;
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pageId } = await request.json();
    const folderId = params.id;

    await connectDB();

    // Verify folder belongs to user
    const folder = await Folder.findOne({
      _id: folderId,
      userId: session.user.id,
    });

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    // Remove page from folder
    folder.pageIds = folder.pageIds.filter((id) => id.toString() !== pageId);
    await folder.save();

    return NextResponse.json(folder);
  } catch (error) {
    console.error("Error removing page from folder:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
