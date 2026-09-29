import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 100,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      maxlength: 10000,
    },
    color: {
      type: String,
      enum: ["violet", "mint", "coral", "gold", "navy"],
      default: "navy",
    },
    tags: {
      type: [
        {
          type: String,
          trim: true,
          lowercase: true,
        },
      ],
      validate: {
        validator: (tags) => tags.length <= 8,
        message: "A note can have at most 8 tags",
      },
    },
    status: {
      type: String,
      enum: ["active", "pinned", "archived", "trashed"],
      default: "active",
    },
  },
  { timestamps: true }
);

noteSchema.index(
  { title: "text", content: "text", tags: "text" },
  { weights: { title: 5, tags: 3, content: 1 } }
);
noteSchema.index({ user: 1, status: 1, createdAt: -1 });
noteSchema.index({ user: 1, category: 1 });

const Note = mongoose.model("Note", noteSchema);

export default Note;
