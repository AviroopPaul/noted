import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      autoTheme: user.autoTheme || {
        enabled: false,
        lightTheme: "light",
        darkTheme: "dark",
      },
    });
  } catch (error) {
    console.error("Error fetching auto theme settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch auto theme settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    console.log("PUT /api/user/auto-theme called");
    
    const session = await getServerSession(authOptions);
    console.log("Session data:", session);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Request body:", body);
    
    const { enabled, lightTheme, darkTheme } = body;

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    console.log("Found user:", user);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.autoTheme = {
      enabled,
      lightTheme,
      darkTheme,
    };
    console.log("Updated autoTheme settings:", user.autoTheme);

    await user.save();
    console.log("User saved successfully");

    const response = { success: true, autoTheme: user.autoTheme };
    console.log("Sending response:", response);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating auto theme settings:", error);
    return NextResponse.json(
      { error: "Failed to update auto theme settings" },
      { status: 500 }
    );
  }
}
