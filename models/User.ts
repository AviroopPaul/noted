import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: String,
    defaultTheme: {
      type: String,
      enum: ["light", "dark"],
      default: "dark",
    },
    displayName: {
      type: String,
      trim: true,
    },
    encryptionKey: {
      type: String,
      required: true,
    },
    sidebarSort: {
      type: String,
      enum: ["alphabetical", "recent", "icon"],
      default: "recent",
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// First check if the model exists
const User = mongoose.models.User || mongoose.model("User", userSchema);

// Now we can safely sync indexes
try {
  User.syncIndexes();
} catch (error) {
  console.error("Error syncing indexes:", error);
}

export default User;
