import User from "../models/User.js";
import Note from "../models/Note.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getPagination, buildPagination } from "../utils/paginate.js";

export const getAdminUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const [users, total] = await Promise.all([
    User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(),
  ]);
  return res.status(200).json({ success: true, message: "Users retrieved", data: users, pagination: buildPagination(total, page, limit) });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  if (req.params.id === req.user.id) {
    return res.status(400).json({ success: false, message: "You cannot change your own administrator role", data: null });
  }
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true, runValidators: true });
  if (!user) return res.status(404).json({ success: false, message: "User not found", data: null });
  return res.status(200).json({ success: true, message: "User role updated", data: user });
});

export const updateUserAccess = asyncHandler(async (req, res) => {
  if (req.params.id === req.user.id) {
    return res.status(400).json({ success: false, message: "You cannot suspend your own account", data: null });
  }
  const user = await User.findByIdAndUpdate(req.params.id, { active: req.body.active }, { new: true, runValidators: true });
  if (!user) return res.status(404).json({ success: false, message: "User not found", data: null });
  return res.status(200).json({ success: true, message: user.active ? "Account access restored" : "Account suspended", data: user });
});

export const getAdminNotes = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const [notes, total] = await Promise.all([
    Note.find().populate("user", "name email").sort({ updatedAt: -1 }).skip(skip).limit(limit),
    Note.countDocuments(),
  ]);
  return res.status(200).json({ success: true, message: "Notes retrieved", data: notes, pagination: buildPagination(total, page, limit) });
});

export const deleteAdminNote = asyncHandler(async (req, res) => {
  const note = await Note.findByIdAndDelete(req.params.id);
  if (!note) return res.status(404).json({ success: false, message: "Note not found", data: null });
  return res.status(200).json({ success: true, message: "Note permanently deleted", data: null });
});
