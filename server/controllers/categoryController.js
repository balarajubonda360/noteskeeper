import Category from "../models/Category.js";
import Note from "../models/Note.js";
import asyncHandler from "../utils/asyncHandler.js";
import { buildPagination, getPagination } from "../utils/paginate.js";

const categoryColors = ["violet", "mint", "coral", "gold", "navy"];
const starterCategories = [
  { name: "Personal", color: "violet", icon: "Heart" },
  { name: "Work", color: "navy", icon: "BriefcaseBusiness" },
  { name: "Ideas", color: "gold", icon: "Lightbulb" },
  { name: "Learning", color: "mint", icon: "BookOpen" },
  { name: "Projects", color: "coral", icon: "Target" },
  { name: "Health", color: "mint", icon: "Heart" },
  { name: "Finance", color: "mint", icon: "Wallet" },
  { name: "Travel", color: "violet", icon: "Plane" },
  { name: "Shopping", color: "coral", icon: "ShoppingBag" },
  { name: "Goals", color: "gold", icon: "Star" },
  { name: "Family", color: "coral", icon: "Users" },
  { name: "Journal", color: "navy", icon: "BookOpen" },
];

const sendDuplicateName = (res) => res.status(409).json({
  success: false,
  message: "A category with this name already exists",
  data: null,
});

/** Create a category owned by the authenticated user. */
export const createCategory = asyncHandler(async (req, res) => {
  const { name, color, icon } = req.body;
  const normalizedName = name.trim();
  const duplicate = await Category.exists({
    user: req.user.id,
    name: normalizedName,
  });

  if (duplicate) return sendDuplicateName(res);

  try {
    const category = await Category.create({
      user: req.user.id,
      name: normalizedName,
      ...(color !== undefined && { color }),
      ...(icon !== undefined && { icon }),
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    if (error.code === 11000) return sendDuplicateName(res);
    throw error;
  }
});

/** List this user's categories with counts of their non-trashed notes. */
export const getCategories = asyncHandler(async (req, res) => {
  const paginationQuery = {
    ...req.query,
    limit: req.query.limit ?? 20,
  };
  const { page, limit, skip } = getPagination(paginationQuery);
  const userId = req.user._id;
  const categoryCount = await Category.countDocuments({ user: userId });
  if (categoryCount === 0) {
    try {
      await Category.bulkWrite(starterCategories.map((category) => ({
        updateOne: {
          filter: { user: userId, name: category.name },
          update: { $setOnInsert: { user: userId, ...category } },
          upsert: true,
        },
      })), { ordered: false });
    } catch (error) {
      // A parallel first page load may seed these at the same time.
      if (error.code !== 11000 && !error.writeErrors?.every((writeError) => writeError.code === 11000)) {
        throw error;
      }
    }
  }
  const [result] = await Category.aggregate([
    { $match: { user: userId } },
    { $sort: { name: 1 } },
    {
      $facet: {
        categories: [
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: Note.collection.name,
              let: { categoryId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$category", "$$categoryId"] },
                    user: userId,
                    status: { $ne: "trashed" },
                  },
                },
                { $count: "count" },
              ],
              as: "noteCountResult",
            },
          },
          {
            $addFields: {
              noteCount: {
                $ifNull: [{ $arrayElemAt: ["$noteCountResult.count", 0] }, 0],
              },
            },
          },
          { $project: { noteCountResult: 0 } },
        ],
        total: [{ $count: "count" }],
      },
    },
  ]);
  const categories = result?.categories ?? [];
  const total = result?.total[0]?.count ?? 0;

  return res.status(200).json({
    success: true,
    message: "Categories retrieved successfully",
    data: categories,
    pagination: buildPagination(total, page, limit),
  });
});

/** Get one category only when it belongs to the authenticated user. */
export const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
      data: null,
    });
  }

  return res.status(200).json({
    success: true,
    message: "Category retrieved successfully",
    data: category,
  });
});

/** Update an owned category while enforcing per-user unique names. */
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
      data: null,
    });
  }

  const updates = {};
  const body = req.body ?? {};
  for (const field of ["name", "color", "icon"]) {
    if (Object.hasOwn(body, field)) updates[field] = body[field];
  }
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Provide at least one category field to update",
      data: null,
    });
  }
  if (updates.name !== undefined) updates.name = updates.name.trim();

  if (updates.name !== undefined) {
    const duplicate = await Category.exists({
      user: req.user.id,
      name: updates.name,
      _id: { $ne: category._id },
    });
    if (duplicate) return sendDuplicateName(res);
  }

  if (updates.color !== undefined && !categoryColors.includes(updates.color)) {
    return res.status(400).json({
      success: false,
      message: "Color must be violet, mint, coral, gold, or navy",
      data: null,
    });
  }

  try {
    Object.assign(category, updates);
    await category.save();
  } catch (error) {
    if (error.code === 11000) return sendDuplicateName(res);
    throw error;
  }

  return res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: category,
  });
});

/** Detach the user's notes, then delete their category. */
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
      data: null,
    });
  }

  await Note.updateMany(
    { category: category._id, user: req.user.id },
    { $set: { category: null } }
  );
  await category.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Category deleted successfully; its notes are now uncategorized",
    data: null,
  });
});
