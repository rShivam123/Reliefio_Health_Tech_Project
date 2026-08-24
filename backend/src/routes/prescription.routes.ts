import { Router } from "express";
import {
  createPrescription,
  getPrescriptionsForPatient,
  getMyPrescriptions,
  getPrescription,
  updatePrescription,
} from "../controllers/prescription.controller.js";
import { protect, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);

router.post("/", requireRole("Doctor"), createPrescription);
router.get("/mine", requireRole("Doctor"), getMyPrescriptions);
router.get("/patient/:patientId", getPrescriptionsForPatient);
router.get("/single/:id", getPrescription);
router.put("/:id", requireRole("Doctor"), updatePrescription);

export default router;
