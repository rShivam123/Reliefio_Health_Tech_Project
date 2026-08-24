import { Router } from "express";
import {
  createAppointment,
  listAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointment.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// All appointment routes require a logged-in user (patient or doctor).
// Ownership/role checks happen inside the controller since a single
// appointment is shared between exactly one patient and one doctor.
router.use(protect);

router.post("/", createAppointment);
router.get("/", listAppointments);
router.get("/:id", getAppointment);
router.put("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);

export default router;
