import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Folder from "@/models/Folder";
import { authOptions } from "../auth/[...nextauth]/route";
import type { CustomSession } from "@/types";

export async function GET() {
  try {
    const session = (await getServerSession(authOptions)) as CustomSession;
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const folders = await Folder.find({ userId: session.user.id });

    return NextResponse.json(folders);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = (await getServerSession(authOptions)) as CustomSession;
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    await connectDB();

    const folder = await Folder.create({
      ...data,
      userId: session.user.id,
    });

    return NextResponse.json(folder);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
