import { Router } from "express";
import { body } from "express-validator";
import { rateLimit } from "express-rate-limit";
import { getMe, login, register } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";

const router = Router();

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication requests. Please try again later.",
    data: null,
  },
});

router.use(authRateLimit);

router.post(
  "/register",
  [
    body("name").isString().withMessage("Name must be text")
      .bail().trim().isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters"),
    body("email").isString().withMessage("Email must be text")
      .bail().trim().isEmail().withMessage("Enter a valid email address")
      .bail().isLength({ max: 254 }).withMessage("Email cannot exceed 254 characters"),
    body("password").isString().withMessage("Password must be text")
      .bail().isLength({ min: 6, max: 128 })
      .withMessage("Password must be between 6 and 128 characters"),
  ],
  validate,
  register
);

router.post(
  "/login",
  [
    body("email").isString().withMessage("Email must be text")
      .bail().trim().isEmail().withMessage("Enter a valid email address")
      .bail().isLength({ max: 254 }).withMessage("Email cannot exceed 254 characters"),
    body("password").isString().withMessage("Password must be text")
      .bail().notEmpty().withMessage("Password is required")
      .bail().isLength({ max: 128 }).withMessage("Password cannot exceed 128 characters"),
  ],
  validate,
  login
);

router.get("/me", protect, getMe);

export default router;
