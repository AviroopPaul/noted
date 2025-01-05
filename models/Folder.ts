import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: "📁",
  },
  pageIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Page",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

folderSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Folder || mongoose.model("Folder", folderSchema);
