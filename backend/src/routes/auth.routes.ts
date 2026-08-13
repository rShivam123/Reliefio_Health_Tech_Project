import { Router } from "express";

import { signup, verifyOTP, login } from "../controllers/auth.controller.js";
 import {forgotPassword} from "../controllers/auth.controller.js";
const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/forgot-password", forgotPassword);
export default router;