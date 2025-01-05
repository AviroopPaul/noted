import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Folder from "@/models/Folder";
import { authOptions } from "../../auth/[...nextauth]/route";
import type { CustomSession } from "@/types";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = (await getServerSession(authOptions)) as CustomSession;
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Verify folder belongs to user and delete it
    const folder = await Folder.findOneAndDelete({
      _id: params.id,
      userId: session.user.id,
    });

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting folder:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = (await getServerSession(authOptions)) as CustomSession;
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await request.json();
    await connectDB();

    const folder = await Folder.findOneAndUpdate(
      { _id: params.id, userId: session.user.id },
      { $set: { name } },
      { new: true }
    );

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    return NextResponse.json(folder);
  } catch (error) {
    console.error("Error updating folder:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
