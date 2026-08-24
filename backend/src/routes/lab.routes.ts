import { Router } from "express";
import {
  getDashboard,
  listTests,
  listPublicTests,
  createTest,
  updateTest,
  deleteTest,
  listOrders,
  getOrder,
  createOrder,
  updateOrder,
  getMyLabOrders,
  searchPatients,
  listSamples,
  createSample,
  updateSample,
  listReports,
  getReport,
  createReport,
  updateReport,
  listLabPatients,
  getLabProfile,
  updateLabProfile,
} from "../controllers/lab.controller.js";
import { protect, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

// Public - lets a patient see available tests when self-ordering.
router.get("/tests/public", listPublicTests);

// Logged-in only from here down. /reports/:id and /my-orders are
// intentionally reachable by Patient and Doctor roles too (ownership is
// checked inside the controller), so they sit before the blanket
// requireRole("Lab") below.
router.get("/reports/:id", protect, getReport);
router.get("/my-orders", protect, getMyLabOrders);

router.use(protect, requireRole("Lab"));

router.get("/dashboard", getDashboard);

router.get("/patients/search", searchPatients);

router.get("/tests", listTests);
router.post("/tests", createTest);
router.put("/tests/:id", updateTest);
router.delete("/tests/:id", deleteTest);

router.get("/orders", listOrders);
router.post("/orders", createOrder);
router.get("/orders/:id", getOrder);
router.put("/orders/:id", updateOrder);

router.get("/samples", listSamples);
router.post("/samples", createSample);
router.put("/samples/:id", updateSample);

router.get("/reports", listReports);
router.post("/reports", createReport);
router.put("/reports/:id", updateReport);

router.get("/patients", listLabPatients);

router.get("/profile", getLabProfile);
router.put("/profile", updateLabProfile);

export default router;
