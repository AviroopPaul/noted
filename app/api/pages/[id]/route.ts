import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Page from "@/models/Page";
import User from "@/models/User";
import { authOptions } from "../../auth/[...nextauth]/route";
import { encrypt, decrypt } from "@/lib/encryption";

// Update a page
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    await connectDB();

    const user = await User.findById(session.user.id);

    // Make sure we're only updating the fields that were sent
    const updateData = {
      ...data,
      updatedAt: new Date(),
      content: data.content
        ? encrypt(data.content, user.encryptionKey)
        : undefined,
      title: data.title ? encrypt(data.title, user.encryptionKey) : undefined,
    };

    const page = await Page.findOneAndUpdate(
      { _id: params.id, userId: session.user.id },
      { $set: updateData },
      { new: true }
    );

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const decryptedPage = {
      ...page.toObject(),
      content: page.content ? decrypt(page.content, user.encryptionKey) : "",
      title: page.title ? decrypt(page.title, user.encryptionKey) : "",
    };

    return NextResponse.json(decryptedPage);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Delete a page
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const page = await Page.findOneAndDelete({
      _id: params.id,
      userId: session.user.id,
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
