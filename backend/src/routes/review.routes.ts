import { Router } from "express";
import { listReviews, listMyReviews, createReview } from "../controllers/review.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", listReviews);
router.get("/mine", protect, listMyReviews);
router.post("/", protect, createReview);

export default router;
