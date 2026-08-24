import { Router } from "express";
import {
  createConsultation,
  getConsultation,
  getConsultationByAppointment,
  updateConsultation,
} from "../controllers/consultation.controller.js";
import { protect, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);

router.post("/", requireRole("Doctor"), createConsultation);
router.get("/appointment/:appointmentId", getConsultationByAppointment);
router.get("/:id", getConsultation);
router.put("/:id", requireRole("Doctor"), updateConsultation);

export default router;
