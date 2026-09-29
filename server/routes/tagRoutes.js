import { Router } from "express";
import { body, param } from "express-validator";
import { createTag, deleteTag, getTag, getTags, updateTag } from "../controllers/tagController.js";
import { protect } from "../middleware/authMiddleware.js";
import paginationValidation from "../middleware/paginationValidation.js";
import validate from "../middleware/validate.js";

const router = Router();
router.use(protect);

router.post(
  "/",
  [body("name").isString().withMessage("Name must be text").bail().trim().isLength({ min: 1, max: 30 }).withMessage("Name must be between 1 and 30 characters")],
  validate,
  createTag
);
router.get("/", paginationValidation, validate, getTags);
router.get("/:id", param("id").isMongoId().withMessage("Invalid tag id"), validate, getTag);
router.put(
  "/:id",
  [
    param("id").isMongoId().withMessage("Invalid tag id"),
    body("name").isString().withMessage("Name must be text").bail().trim().isLength({ min: 1, max: 30 }).withMessage("Name must be between 1 and 30 characters"),
  ],
  validate,
  updateTag
);
router.delete("/:id", param("id").isMongoId().withMessage("Invalid tag id"), validate, deleteTag);

export default router;
