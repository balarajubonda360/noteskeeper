import { Router } from "express";
import { body, param } from "express-validator";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../controllers/categoryController.js";
import { protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import paginationValidation from "../middleware/paginationValidation.js";

const router = Router();
const colors = ["violet", "mint", "coral", "gold", "navy"];
const icons = ["Folder", "BookOpen", "BriefcaseBusiness", "Code2", "Heart", "Lightbulb", "Plane", "ShoppingBag", "Star", "Target", "Users", "Wallet"];

router.use(protect);

router.post(
  "/",
  [
    body("name").isString().withMessage("Name must be text")
      .bail().trim().isLength({ min: 1, max: 30 })
      .withMessage("Name must be between 1 and 30 characters"),
    body("color").optional().isIn(colors)
      .withMessage("Color must be violet, mint, coral, gold, or navy"),
    body("icon").optional().isIn(icons).withMessage("Icon is not supported"),
  ],
  validate,
  createCategory
);

router.get("/", paginationValidation, validate, getCategories);

router.get(
  "/:id",
  param("id").isMongoId().withMessage("Invalid category id"),
  validate,
  getCategory
);

router.put(
  "/:id",
  [
    param("id").isMongoId().withMessage("Invalid category id"),
    body("name").optional().isString().withMessage("Name must be text")
      .bail().trim().isLength({ min: 1, max: 30 })
      .withMessage("Name must be between 1 and 30 characters"),
    body("color").optional().isIn(colors)
      .withMessage("Color must be violet, mint, coral, gold, or navy"),
    body("icon").optional().isIn(icons).withMessage("Icon is not supported"),
  ],
  validate,
  updateCategory
);

router.delete(
  "/:id",
  param("id").isMongoId().withMessage("Invalid category id"),
  validate,
  deleteCategory
);

export default router;
