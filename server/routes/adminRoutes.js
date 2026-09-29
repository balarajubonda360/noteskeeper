import { Router } from "express";
import { body, param } from "express-validator";
import { deleteAdminNote, getAdminNotes, getAdminUsers, updateUserAccess, updateUserRole } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import requireAdmin from "../middleware/adminMiddleware.js";
import paginationValidation from "../middleware/paginationValidation.js";
import validate from "../middleware/validate.js";

const router = Router();
router.use(protect, requireAdmin);
router.get("/users", paginationValidation, validate, getAdminUsers);
router.patch("/users/:id/role", [param("id").isMongoId(), body("role").isIn(["user", "admin"])], validate, updateUserRole);
router.patch("/users/:id/access", [param("id").isMongoId(), body("active").isBoolean()], validate, updateUserAccess);
router.get("/notes", paginationValidation, validate, getAdminNotes);
router.delete("/notes/:id", param("id").isMongoId(), validate, deleteAdminNote);
export default router;
