import mongoose from "mongoose";
import User from "../models/User";
import Page from "../models/Page";
import * as dotenv from "dotenv";
import path from "path";
import { generateUserEncryptionKey, encrypt } from "../lib/encryption";

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

    // Find all users without an encryption key
    const users = await User.find({ encryptionKey: { $exists: false } });
    console.log(`Found ${users.length} users without encryption keys`);

    // Update each user individually and encrypt their pages
    for (const user of users) {
      console.log(`Processing user: ${user.email}`);

      // Generate new encryption key
      const encryptionKey = generateUserEncryptionKey();

      // Find all pages for this user
      const pages = await Page.find({ userId: user._id });
      console.log(`Found ${pages.length} pages for user ${user.email}`);

      // Encrypt content of each page
      for (const page of pages) {
        const updatedData = {
          content: page.content ? encrypt(page.content, encryptionKey) : "",
          title: page.title ? encrypt(page.title, encryptionKey) : "",
        };

        await Page.findByIdAndUpdate(page._id, {
          $set: updatedData,
        });
        console.log(`Encrypted page ${page._id}`);
      }

      // Update the user with their new encryption key
      await User.findByIdAndUpdate(user._id, {
        $set: { encryptionKey: encryptionKey },
      });

      console.log(
        `Added encryption key and encrypted pages for user: ${user.email}`
      );
    }

    console.log(`Migration completed. Updated ${users.length} users`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
}

migrateUsers();
