import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { authOptions } from "../../auth/[...nextauth]/route";

// Add type for the session user
interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  defaultTheme?: string;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as SessionUser;
    await connectDB();
    const dbUser = await User.findById(user.id);

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      defaultTheme: dbUser.defaultTheme ?? "dark",
      sidebarSort: dbUser.sidebarSort ?? "recent",
    });
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as SessionUser;
    const { defaultTheme, sidebarSort } = await request.json();

    const updateData: { defaultTheme?: string; sidebarSort?: string } = {};
    if (defaultTheme) updateData.defaultTheme = defaultTheme;
    if (sidebarSort) updateData.sidebarSort = sidebarSort;

    await connectDB();
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      defaultTheme: updatedUser.defaultTheme,
      sidebarSort: updatedUser.sidebarSort,
    });
  } catch (error) {
    console.error("Settings PATCH error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
