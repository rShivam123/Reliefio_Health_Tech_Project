import { Router } from "express";
import {
  getDashboard,
  getPhysicianAppointments,
  getPhysicianPatients,
  getPhysicianPatientDetail,
  getPhysicianProfile,
  updatePhysicianProfile,
  getAvailability,
  updateAvailability,
} from "../controllers/physician.controller.js";
import { protect, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect, requireRole("Doctor"));

router.get("/dashboard", getDashboard);
router.get("/appointments", getPhysicianAppointments);
router.get("/patients", getPhysicianPatients);
router.get("/patients/:id", getPhysicianPatientDetail);
router.get("/profile", getPhysicianProfile);
router.put("/profile", updatePhysicianProfile);
router.get("/availability", getAvailability);
router.put("/availability", updateAvailability);

export default router;
