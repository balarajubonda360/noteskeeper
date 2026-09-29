import { Router } from "express";
import { getQuotes } from "../controllers/quoteController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/", getQuotes);

export default router;
