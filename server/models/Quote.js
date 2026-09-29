import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    label: { type: String, required: true, trim: true, maxlength: 40 },
    text: { type: String, required: true, trim: true, maxlength: 240 },
    color: { type: String, required: true, enum: ["honey", "peach", "mint"] },
    tilt: { type: String, required: true, enum: ["left", "right"] },
  },
  { timestamps: true }
);

const Quote = mongoose.model("Quote", quoteSchema);

export default Quote;
