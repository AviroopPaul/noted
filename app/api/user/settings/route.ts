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
    // @ts-expect-error - Temporarily ignore the type error for authOptions
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

    const theme = dbUser.get("defaultTheme") ?? "dark";

    return NextResponse.json({
      defaultTheme: theme,
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
    // @ts-expect-error - Temporarily ignore the type error for authOptions
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as SessionUser;
    const { defaultTheme } = await request.json();

    // Add debugging logs
    console.log("Updating user:", {
      userId: user.id,
      newTheme: defaultTheme,
    });

    await connectDB();

    // First, let's check if we can find the user
    const existingUser = await User.findById(user.id);
    console.log("Existing user:", existingUser);

    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { $set: { defaultTheme } }, // Using $set to ensure we're updating the field
      { new: true }
    );

    console.log("Updated user:", updatedUser);

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      defaultTheme: updatedUser.defaultTheme,
    });
  } catch (error) {
    console.error("Settings PATCH error:", error);
    // Log more detailed error information
    if (error instanceof Error) {
      console.error({
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
