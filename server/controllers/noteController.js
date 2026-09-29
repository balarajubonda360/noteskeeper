import mongoose from "mongoose";
import Category from "../models/Category.js";
import Note from "../models/Note.js";
import { buildPagination, getPagination } from "../utils/paginate.js";
import asyncHandler from "../utils/asyncHandler.js";

const noteColors = ["violet", "mint", "coral", "gold", "navy"];
const noteStatuses = ["active", "pinned", "archived", "trashed"];

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const populateCategory = (query, userId) => query.populate({
  path: "category",
  select: "name color",
  match: { user: userId },
});

/** Ensure an optional category exists and belongs to this user's account. */
const validateOwnedCategory = async (categoryId, userId) => {
  if (categoryId === undefined || categoryId === null || categoryId === "") {
    return true;
  }

  if (!mongoose.isValidObjectId(categoryId)) return false;
  return Boolean(await Category.exists({ _id: categoryId, user: userId }));
};

/** Create a note for the authenticated user. */
export const createNote = asyncHandler(async (req, res) => {
  const { title, content, color, tags, category } = req.body;

  if (!(await validateOwnedCategory(category, req.user.id))) {
    return res.status(400).json({
      success: false,
      message: "Category is invalid or does not belong to this user",
      data: null,
    });
  }

  const note = await Note.create({
    user: req.user.id,
    title,
    content,
    ...(color !== undefined && { color }),
    ...(tags !== undefined && { tags }),
    ...(category !== undefined && { category: category || null }),
  });

  return res.status(201).json({
    success: true,
    message: "Note created successfully",
    data: note,
  });
});

/** List the authenticated user's non-trashed notes with pagination. */
export const getNotes = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  // Aggregation pipelines do not cast string ids the way Mongoose queries do.
  const userId = req.user._id;
  const filter = { user: userId, status: { $ne: "trashed" } };
  const [result] = await Note.aggregate([
    { $match: filter },
    {
      $addFields: {
        pinnedFirst: { $cond: [{ $eq: ["$status", "pinned"] }, 1, 0] },
      },
    },
    { $sort: { pinnedFirst: -1, createdAt: -1 } },
    {
      $facet: {
        notes: [
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: "categories",
              localField: "category",
              foreignField: "_id",
              pipeline: [
                { $match: { user: userId } },
                { $project: { name: 1, color: 1 } },
              ],
              as: "category",
            },
          },
          {
            $unwind: {
              path: "$category",
              preserveNullAndEmptyArrays: true,
            },
          },
          { $project: { pinnedFirst: 0 } },
        ],
        total: [{ $count: "count" }],
      },
    },
  ]);
  const notes = result?.notes ?? [];
  const total = result?.total[0]?.count ?? 0;

  return res.status(200).json({
    success: true,
    message: "Notes retrieved successfully",
    data: notes,
    pagination: buildPagination(total, page, limit),
  });
});

/** Find one note belonging to the authenticated user. */
export const getNote = asyncHandler(async (req, res) => {
  const note = await populateCategory(
    Note.findOne({ _id: req.params.id, user: req.user.id }),
    req.user.id
  );

  if (!note) {
    return res.status(404).json({
      success: false,
      message: "Note not found",
      data: null,
    });
  }

  return res.status(200).json({
    success: true,
    message: "Note retrieved successfully",
    data: note,
  });
});

/** Update editable fields on an owned note. */
export const updateNote = asyncHandler(async (req, res) => {
  const allowedFields = ["title", "content", "color", "tags", "category"];
  const updates = {};
  const body = req.body ?? {};

  for (const field of allowedFields) {
    if (Object.hasOwn(body, field)) updates[field] = body[field];
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Provide at least one note field to update",
      data: null,
    });
  }

  if (Object.hasOwn(updates, "category")) {
    if (!(await validateOwnedCategory(updates.category, req.user.id))) {
      return res.status(400).json({
        success: false,
        message: "Category is invalid or does not belong to this user",
        data: null,
      });
    }
    if (!updates.category) updates.category = null;
  }

  if (updates.color !== undefined && !noteColors.includes(updates.color)) {
    return res.status(400).json({
      success: false,
      message: "Color must be violet, mint, coral, gold, or navy",
      data: null,
    });
  }

  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { $set: updates },
    { returnDocument: "after", runValidators: true }
  );

  if (!note) {
    return res.status(404).json({
      success: false,
      message: "Note not found",
      data: null,
    });
  }

  await note.populate({ path: "category", select: "name color", match: { user: req.user.id } });

  return res.status(200).json({
    success: true,
    message: "Note updated successfully",
    data: note,
  });
});

/** Permanently delete a note owned by the authenticated user. */
export const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!note) {
    return res.status(404).json({
      success: false,
      message: "Note not found",
      data: null,
    });
  }

  return res.status(200).json({
    success: true,
    message: "Note deleted successfully",
    data: null,
  });
});

/** Search this user's non-trashed notes with text search and partial-match fallback. */
export const searchNotes = asyncHandler(async (req, res) => {
  const searchText = req.query.q.trim();
  const { page, limit, skip } = getPagination(req.query);
  const baseFilter = { user: req.user.id, status: { $ne: "trashed" } };
  const textFilter = { ...baseFilter, $text: { $search: searchText } };
  const projection = { score: { $meta: "textScore" } };
  let total = await Note.countDocuments(textFilter);
  let notes;

  if (total > 0) {
    notes = await populateCategory(
      Note.find(textFilter, projection)
        .sort({ score: { $meta: "textScore" } })
        .skip(skip)
        .limit(limit),
      req.user.id
    );
  } else {
    const partialMatch = new RegExp(escapeRegex(searchText), "i");
    const fallbackFilter = {
      ...baseFilter,
      $or: [
        { title: partialMatch },
        { content: partialMatch },
        { tags: partialMatch },
      ],
    };
    [notes, total] = await Promise.all([
      populateCategory(Note.find(fallbackFilter).sort({ createdAt: -1 }).skip(skip).limit(limit), req.user.id),
      Note.countDocuments(fallbackFilter),
    ]);
  }

  return res.status(200).json({
    success: true,
    message: "Search results retrieved successfully",
    data: notes,
    pagination: buildPagination(total, page, limit),
  });
});

/** Change the status of an owned note. */
export const updateNoteStatus = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { $set: { status: req.body.status } },
    { returnDocument: "after", runValidators: true }
  );

  if (!note) {
    return res.status(404).json({
      success: false,
      message: "Note not found",
      data: null,
    });
  }

  await note.populate({ path: "category", select: "name color", match: { user: req.user.id } });

  return res.status(200).json({
    success: true,
    message: "Note status updated successfully",
    data: note,
  });
});

/** Return this user's note counts and seven UTC calendar days of activity. */
export const getNoteStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const today = new Date();
  const todayStart = new Date(Date.UTC(
    today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()
  ));
  const firstDay = new Date(todayStart);
  firstDay.setUTCDate(firstDay.getUTCDate() - 6);
  const activeFilter = { user: userId, status: { $ne: "trashed" } };

  const [statusCounts, colorCounts, categoryCounts, recentCounts] = await Promise.all([
    Note.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Note.aggregate([
      { $match: activeFilter },
      { $group: { _id: "$color", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Note.aggregate([
      { $match: { ...activeFilter, category: { $ne: null } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          pipeline: [{ $match: { user: userId } }, { $project: { name: 1 } }],
          as: "category",
        },
      },
      { $unwind: "$category" },
      { $project: { _id: 0, category: "$category.name", count: 1 } },
      { $sort: { category: 1 } },
    ]),
    Note.aggregate([
      { $match: { ...activeFilter, createdAt: { $gte: firstDay, $lt: new Date(todayStart.getTime() + 86400000) } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "UTC" } },
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  const countsByStatus = Object.fromEntries(statusCounts.map(({ _id, count }) => [_id, count]));
  const dailyCounts = Object.fromEntries(recentCounts.map(({ _id, count }) => [_id, count]));
  const last7Days = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date(firstDay);
    date.setUTCDate(date.getUTCDate() + offset);
    const key = date.toISOString().slice(0, 10);
    return { date: key, count: dailyCounts[key] ?? 0 };
  });
  const total = Object.entries(countsByStatus)
    .filter(([status]) => status !== "trashed")
    .reduce((sum, [, count]) => sum + count, 0);

  return res.status(200).json({
    success: true,
    message: "Note statistics retrieved successfully",
    data: {
      totals: {
        total,
        active: countsByStatus.active ?? 0,
        pinned: countsByStatus.pinned ?? 0,
        archived: countsByStatus.archived ?? 0,
        trashed: countsByStatus.trashed ?? 0,
      },
      byColor: colorCounts.map(({ _id, count }) => ({ color: _id, count })),
      byCategory: categoryCounts,
      last7Days,
    },
  });
});

/** Filter this user's notes by category, color, status, tag, dates, and sort. */
export const filterNotes = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { user: req.user.id };

  if (req.query.status) {
    filter.status = req.query.status;
  } else {
    filter.status = { $ne: "trashed" };
  }
  if (req.query.category) filter.category = req.query.category;
  if (req.query.color) filter.color = req.query.color;
  if (req.query.tag) filter.tags = req.query.tag.trim().toLowerCase();
  if (req.query.from || req.query.to) {
    filter.createdAt = {};
    if (req.query.from) filter.createdAt.$gte = new Date(req.query.from);
    if (req.query.to) {
      const endDate = new Date(req.query.to);
      if (/^\d{4}-\d{2}-\d{2}$/.test(req.query.to)) {
        endDate.setUTCHours(23, 59, 59, 999);
      }
      filter.createdAt.$lte = endDate;
    }
  }

  const sortOptions = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    title: { title: 1 },
  };
  const sort = sortOptions[req.query.sort || "newest"];
  const [notes, total] = await Promise.all([
    populateCategory(Note.find(filter).sort(sort).skip(skip).limit(limit), req.user.id),
    Note.countDocuments(filter),
  ]);

  return res.status(200).json({
    success: true,
    message: "Filtered notes retrieved successfully",
    data: notes,
    pagination: buildPagination(total, page, limit),
  });
});

export { noteColors, noteStatuses };
