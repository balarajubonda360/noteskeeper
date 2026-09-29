import { Router } from "express";
import { body, param, query } from "express-validator";
import {
  createNote,
  deleteNote,
  filterNotes,
  getNote,
  getNoteStats,
  getNotes,
  noteColors,
  noteStatuses,
  searchNotes,
  updateNote,
  updateNoteStatus,
} from "../controllers/noteController.js";
import { protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import paginationValidation from "../middleware/paginationValidation.js";

const router = Router();

router.use(protect);

const noteFields = [
  body("title").isString().withMessage("Title must be text")
    .bail().trim().notEmpty().withMessage("Title is required")
    .bail().isLength({ max: 100 }).withMessage("Title cannot exceed 100 characters"),
  body("content").isString().withMessage("Content must be text")
    .bail().trim().notEmpty().withMessage("Content is required")
    .bail().isLength({ max: 10000 }).withMessage("Content cannot exceed 10000 characters"),
  body("color").optional().isIn(["violet", "mint", "coral", "gold", "navy"])
    .withMessage("Color must be violet, mint, coral, gold, or navy"),
  body("tags").optional().isArray({ max: 8 })
    .withMessage("Tags must be an array with at most 8 items"),
  body("tags.*").optional().isString().withMessage("Each tag must be a string")
    .bail().isLength({ max: 30 }).withMessage("Tags cannot exceed 30 characters"),
  body("category").optional({ values: "null" }).isMongoId()
    .withMessage("Category must be a valid MongoDB id"),
];

router.post("/", noteFields, validate, createNote);
router.get("/", paginationValidation, validate, getNotes);

// Register special routes such as /search, /stats, /filter, and /:id/status here before /:id.

router.get(
  "/search",
  [
    query("q").isString().withMessage("Search query q must be text")
      .bail().trim().notEmpty().withMessage("Search query q is required")
      .bail().isLength({ max: 100 }).withMessage("Search query q cannot exceed 100 characters"),
    ...paginationValidation,
  ],
  validate,
  searchNotes
);

router.get("/stats", getNoteStats);

router.get(
  "/filter",
  [
    query("category").optional().isMongoId().withMessage("Category must be a valid MongoDB id"),
    query("color").optional().isIn(noteColors).withMessage("Invalid color"),
    query("status").optional().isIn(noteStatuses).withMessage("Invalid status"),
    query("sort").optional().isIn(["newest", "oldest", "title"])
      .withMessage("Sort must be newest, oldest, or title"),
    query("from").optional().isISO8601({ strict: true }).withMessage("from must be a valid ISO date"),
    query("to").optional().isISO8601({ strict: true }).withMessage("to must be a valid ISO date")
      .bail().custom((to, { req }) => {
        if (req.query.from && new Date(req.query.from) > new Date(to)) {
          throw new Error("from must be on or before to");
        }
        return true;
      }),
    query("tag").optional().isString().withMessage("tag must be a string")
      .bail().isLength({ max: 30 }).withMessage("tag cannot exceed 30 characters"),
    ...paginationValidation,
  ],
  validate,
  filterNotes
);

router.patch(
  "/:id/status",
  [
    param("id").isMongoId().withMessage("Invalid note id"),
    body("status").isIn(noteStatuses).withMessage("Invalid note status"),
  ],
  validate,
  updateNoteStatus
);

router.get("/:id", param("id").isMongoId().withMessage("Invalid note id"), validate, getNote);
router.put(
  "/:id",
  [
    param("id").isMongoId().withMessage("Invalid note id"),
    body("title").optional().isString().withMessage("Title must be text")
      .bail().trim().notEmpty().withMessage("Title cannot be empty")
      .bail().isLength({ max: 100 }).withMessage("Title cannot exceed 100 characters"),
    body("content").optional().isString().withMessage("Content must be text")
      .bail().trim().notEmpty().withMessage("Content cannot be empty")
      .bail().isLength({ max: 10000 }).withMessage("Content cannot exceed 10000 characters"),
    body("color").optional().isIn(["violet", "mint", "coral", "gold", "navy"])
      .withMessage("Color must be violet, mint, coral, gold, or navy"),
    body("tags").optional().isArray({ max: 8 })
      .withMessage("Tags must be an array with at most 8 items"),
    body("tags.*").optional().isString().withMessage("Each tag must be a string")
      .bail().isLength({ max: 30 }).withMessage("Tags cannot exceed 30 characters"),
    body("category").optional({ values: "null" }).isMongoId()
      .withMessage("Category must be a valid MongoDB id"),
  ],
  validate,
  updateNote
);
router.delete("/:id", param("id").isMongoId().withMessage("Invalid note id"), validate, deleteNote);

export default router;
