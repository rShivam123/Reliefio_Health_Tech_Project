import { Router } from "express";
import {
  listDoctors,
  listSpecialties,
  getDoctor,
  getDoctorSlots,
  createDoctorProfile,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctor.controller.js";
import { protect, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

// Public - the patient-facing directory never requires login to browse
router.get("/", listDoctors);
router.get("/specialties", listSpecialties);
router.get("/:id", getDoctor);
router.get("/:id/slots", getDoctorSlots);

// Doctor-only - managing one's own profile
router.post("/", protect, requireRole("Doctor"), createDoctorProfile);
router.put("/:id", protect, requireRole("Doctor"), updateDoctor);
router.delete("/:id", protect, requireRole("Doctor"), deleteDoctor);

export default router;
