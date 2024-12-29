import mongoose from "mongoose";
import User from "../models/User";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function migrateUsers() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    // Update all users that don't have a defaultTheme field
    const result = await User.updateMany(
      { defaultTheme: { $exists: false } },
      { $set: { defaultTheme: "dark" } }
    );

    console.log(`Updated ${result.modifiedCount} users`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
}

migrateUsers();
