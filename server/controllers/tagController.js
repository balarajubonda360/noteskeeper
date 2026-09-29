import Tag from "../models/Tag.js";
import Note from "../models/Note.js";
import asyncHandler from "../utils/asyncHandler.js";
import { buildPagination, getPagination } from "../utils/paginate.js";

const duplicateTag = (res) => res.status(409).json({
  success: false,
  message: "A tag with this name already exists",
  data: null,
});

export const createTag = asyncHandler(async (req, res) => {
  const name = req.body.name.trim().toLowerCase();
  try {
    const tag = await Tag.create({ user: req.user.id, name });
    return res.status(201).json({ success: true, message: "Tag created successfully", data: tag });
  } catch (error) {
    if (error.code === 11000) return duplicateTag(res);
    throw error;
  }
});

export const getTags = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const [tags, total] = await Promise.all([
    Tag.aggregate([
      { $match: { user: req.user._id } },
      { $sort: { name: 1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: Note.collection.name,
          let: { tagName: "$name" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$$tagName", "$tags"] },
                user: req.user._id,
                status: { $ne: "trashed" },
              },
            },
            { $count: "count" },
          ],
          as: "noteCountResult",
        },
      },
      { $addFields: { noteCount: { $ifNull: [{ $arrayElemAt: ["$noteCountResult.count", 0] }, 0] } } },
      { $project: { noteCountResult: 0 } },
    ]),
    Tag.countDocuments({ user: req.user.id }),
  ]);

  return res.status(200).json({
    success: true,
    message: "Tags retrieved successfully",
    data: tags,
    pagination: buildPagination(total, page, limit),
  });
});

export const getTag = asyncHandler(async (req, res) => {
  const tag = await Tag.findOne({ _id: req.params.id, user: req.user.id });
  if (!tag) return res.status(404).json({ success: false, message: "Tag not found", data: null });
  const noteCount = await Note.countDocuments({
    user: req.user.id,
    status: { $ne: "trashed" },
    tags: tag.name,
  });
  return res.status(200).json({
    success: true,
    message: "Tag retrieved successfully",
    data: { ...tag.toObject(), noteCount },
  });
});

export const updateTag = asyncHandler(async (req, res) => {
  const tag = await Tag.findOne({ _id: req.params.id, user: req.user.id });
  if (!tag) return res.status(404).json({ success: false, message: "Tag not found", data: null });
  const name = req.body.name.trim().toLowerCase();
  const duplicate = await Tag.exists({ user: req.user.id, name, _id: { $ne: tag._id } });
  if (duplicate) return duplicateTag(res);

  const previousName = tag.name;
  try {
    tag.name = name;
    await tag.save();
  } catch (error) {
    if (error.code === 11000) return duplicateTag(res);
    throw error;
  }
  if (previousName !== name) {
    await Note.collection.updateMany(
      { user: req.user._id, tags: previousName },
      [{ $set: { tags: { $map: {
        input: "$tags",
        as: "tagName",
        in: { $cond: [{ $eq: ["$$tagName", previousName] }, name, "$$tagName"] },
      } } } }]
    );
  }
  return res.status(200).json({ success: true, message: "Tag updated successfully", data: tag });
});

export const deleteTag = asyncHandler(async (req, res) => {
  const tag = await Tag.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!tag) return res.status(404).json({ success: false, message: "Tag not found", data: null });
  await Note.updateMany({ user: req.user.id }, { $pull: { tags: tag.name } });
  return res.status(200).json({ success: true, message: "Tag deleted successfully", data: null });
});
