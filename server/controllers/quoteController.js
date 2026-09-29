import Quote from "../models/Quote.js";
import asyncHandler from "../utils/asyncHandler.js";

/** Return shared inspiration cards for the signed-in workspace. */
export const getQuotes = asyncHandler(async (req, res) => {
  const quotes = await Quote.find().sort({ key: 1 }).select("label text color tilt -_id").lean();
  return res.status(200).json({ success: true, data: quotes });
});
