import mongoose from "mongoose";

const pageSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    default: "Untitled",
  },
  content: {
    type: String,
    default: "<p></p>",
  },
  icon: {
    type: String,
    default: "📄",
  },
  cover: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

pageSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Page || mongoose.model("Page", pageSchema);
