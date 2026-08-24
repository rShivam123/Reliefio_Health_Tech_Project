import { Response } from "express";
import Lab from "../models/lab.js";
import Doctor from "../models/doctor.js";
import LabTest from "../models/labTest.js";
import LabOrder from "../models/labOrder.js";
import LabSample from "../models/labSample.js";
import LabReport from "../models/labReport.js";
import User from "../models/user.js";
import asyncHandler from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { ok } from "../utils/ApiResponse.js";
import { AuthedRequest } from "../middleware/auth.middleware.js";
import { notify } from "../services/notification.service.js";

const getOwnLab = async (req: AuthedRequest) => {
  const lab = await Lab.findOne({ user: req.user!._id });
  if (!lab) {
    throw new AppError("No lab profile found for this account. Please complete your lab profile first.", 404);
  }
  return lab;
};

// GET /api/lab/dashboard
export const getDashboard = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const lab = await getOwnLab(req);
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const [
    totalOrders,
    pendingSamples,
    processing,
    reportsPending,
    reportsCompleted,
    todaysOrders,
    recentOrders,
    recentReports,
  ] = await Promise.all([
    LabOrder.countDocuments({ lab: lab._id }),
    LabSample.countDocuments({ lab: lab._id, status: { $in: ["Pending", "Collected"] } }),
    LabOrder.countDocuments({ lab: lab._id, status: "Processing" }),
    LabReport.countDocuments({ lab: lab._id, verificationStatus: { $in: ["Draft", "Processing", "Pending Verification"] } }),
    LabReport.countDocuments({ lab: lab._id, verificationStatus: "Published" }),
    LabOrder.find({ lab: lab._id, createdAt: { $gte: startOfDay }, paymentStatus: "Paid" }),
    LabOrder.find({ lab: lab._id }).sort({ createdAt: -1 }).limit(5).populate("patient", "firstName lastName"),
    LabReport.find({ lab: lab._id }).sort({ createdAt: -1 }).limit(5),
  ]);

  const todaysRevenue = todaysOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  res.json(
    ok("Dashboard fetched", {
      labName: lab.labName,
      totalOrders,
      pendingSamples,
      processing,
      reportsPending,
      reportsCompleted,
      todaysRevenue,
      recentOrders,
      recentReports,
    })
  );
});

// ---------- TESTS ----------

// GET /api/lab/tests
export const listTests = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const lab = await getOwnLab(req);
  const { search } = req.query as Record<string, string>;

  const filter: Record<string, unknown> = { lab: lab._id };
  if (search) filter.name = { $regex: search, $options: "i" };

  const tests = await LabTest.find(filter).sort({ createdAt: -1 });
  res.json(ok("Tests fetched", tests));
});

// GET /api/lab/tests/public?labId= - used by patients ordering tests (no auth required)
export const listPublicTests = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const filter: Record<string, unknown> = { isActive: true };
  if (req.query.labId) filter.lab = req.query.labId;
  const tests = await LabTest.find(filter).populate("lab", "labName city").sort({ name: 1 });
  res.json(ok("Tests fetched", tests));
});

// POST /api/lab/tests
export const createTest = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const lab = await getOwnLab(req);
  const { name, category, price, sampleType, turnaroundTime, preparationInstructions, parameters } = req.body;

  if (!name || price === undefined || !sampleType) {
    throw new AppError("name, price and sampleType are required", 400);
  }

  const test = await LabTest.create({
    lab: lab._id,
    name,
    category,
    price,
    sampleType,
    turnaroundTime,
    preparationInstructions,
    parameters: parameters || [],
  });

  res.status(201).json(ok("Test added successfully", test));
});

// PUT /api/lab/tests/:id
export const updateTest = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const lab = await getOwnLab(req);
  const test = await LabTest.findOne({ _id: req.params.id, lab: lab._id });
  if (!test) throw new AppError("Test not found", 404);

  const allowed = ["name", "category", "price", "sampleType", "turnaroundTime", "preparationInstructions", "parameters", "isActive"];
  for (const field of allowed) {
    if (field in req.body) (test as any)[field] = req.body[field];
  }

  await test.save();
  res.json(ok("Test updated successfully", test));
});

// DELETE /api/lab/tests/:id (soft delete)
export const deleteTest = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const lab = await getOwnLab(req);
  const test = await LabTest.findOne({ _id: req.params.id, lab: lab._id });
  if (!test) throw new AppError("Test not found", 404);

  test.isActive = false;
  await test.save();

  res.json(ok("Test deactivated"));
});

// GET /api/lab/my-orders (any authenticated user - intended for Patients)
// Lets a patient see lab orders placed against their own account, across
// every lab, plus a pointer to the report once one exists.
export const getMyLabOrders = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const orders = await LabOrder.find({ patient: req.user!._id })
    .populate("lab", "labName city")
    .populate("doctor", "name specialty")
    .sort({ createdAt: -1 });

  const withReports = await Promise.all(
    orders.map(async (order) => {
      const report = await LabReport.findOne({ order: order._id }).select("_id verificationStatus");
      return { ...order.toObject(), report: report ? { _id: report._id, verificationStatus: report.verificationStatus } : null };
    })
  );

  res.json(ok("Your lab orders fetched", withReports));
});

// GET /api/lab/patients/search?q=... (Lab only)
// Lets a lab attach an order to an existing registered patient account
// instead of always creating a disconnected walk-in record.
export const searchPatients = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const { q } = req.query as Record<string, string>;
  if (!q || q.trim().length < 2) {
    res.json(ok("Patients fetched", []));
    return;
  }

  const patients = await User.find({
    role: "Patient",
    $or: [
      { firstName: { $regex: q, $options: "i" } },
      { lastName: { $regex: q, $options: "i" } },
      { phone: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
    ],
  })
    .select("firstName lastName phone email")
    .limit(10);

  res.json(ok("Patients fetched", patients));
});

// ---------- ORDERS ----------

// GET /api/lab/orders
export const listOrders = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const lab = await getOwnLab(req);
  const { status, search } = req.query as Record<string, string>;

  const filter: Record<string, unknown> = { lab: lab._id };
  if (status) filter.status = status;

  let orders = await LabOrder.find(filter)
    .populate("patient", "firstName lastName phone")
    .populate("doctor", "name specialty")
    .sort({ createdAt: -1 });

  if (search) {
    const term = search.toLowerCase();
    orders = orders.filter((o) => {
      const patientName = o.patient
        ? `${(o.patient as any).firstName} ${(o.patient as any).lastName}`
        : o.walkInPatient?.name || "";
      return patientName.toLowerCase().includes(term) || o._id.toString().includes(term);
    });
  }

  res.json(ok("Orders fetched", orders));
});

// GET /api/lab/orders/:id
export const getOrder = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const lab = await getOwnLab(req);
  const order = await LabOrder.findOne({ _id: req.params.id, lab: lab._id })
    .populate("patient", "firstName lastName phone email")
    .populate("doctor", "name specialty");
  if (!order) throw new AppError("Order not found", 404);
  res.json(ok("Order fetched", order));
});

// POST /api/lab/orders (create a walk-in or doctor-referred order)
export const createOrder = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const lab = await getOwnLab(req);
  const { patientId, walkInPatient, doctorId, testIds } = req.body;

  if (!patientId && !walkInPatient?.name) {
    throw new AppError("Either patientId or walkInPatient details are required", 400);
  }
  if (!Array.isArray(testIds) || testIds.length === 0) {
    throw new AppError("At least one test must be selected", 400);
  }

  const tests = await LabTest.find({ _id: { $in: testIds }, lab: lab._id });
  if (tests.length !== testIds.length) throw new AppError("One or more tests are invalid", 400);

  const orderedTests = tests.map((t) => ({ test: t._id, name: t.name, price: t.price, sampleType: t.sampleType }));
  const totalAmount = orderedTests.reduce((sum, t) => sum + t.price, 0);

  const order = await LabOrder.create({
    patient: patientId || undefined,
    walkInPatient: patientId ? undefined : walkInPatient,
    doctor: doctorId || undefined,
    lab: lab._id,
    tests: orderedTests,
    totalAmount,
  });

  if (patientId) {
    await notify(patientId, "Lab order created", `A new lab order with ${orderedTests.length} test(s) was created at ${lab.labName}.`, "lab-order");
  }

  res.status(201).json(ok("Order created successfully", order));
});

// PUT /api/lab/orders/:id
export const updateOrder = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const lab = await getOwnLab(req);
  const order = await LabOrder.findOne({ _id: req.params.id, lab: lab._id });
  if (!order) throw new AppError("Order not found", 404);

  const { status, paymentStatus } = req.body;
  if (status) order.status = status;
  if (paymentStatus) order.paymentStatus = paymentStatus;

  await order.save();

  if (status && order.patient) {
    await notify(order.patient, "Lab order updated", `Your order status changed to "${status}".`, "lab-order");
  }

  res.json(ok("Order updated successfully", order));
});

// ---------- SAMPLES ----------

// GET /api/lab/samples
export const listSamples = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const lab = await getOwnLab(req);
  const { status } = req.query as Record<string, string>;

  const filter: Record<string, unknown> = { lab: lab._id };
  if (status) filter.status = status;

  const samples = await LabSample.find(filter).populate("order", "totalAmount status").sort({ createdAt: -1 });
  res.json(ok("Samples fetched", samples));
});

// POST /api/lab/samples (register a sample against an order)
export const createSample = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const lab = await getOwnLab(req);
  const { orderId, patientName, sampleType, notes } = req.body;

  const order = await LabOrder.findOne({ _id: orderId, lab: lab._id });
  if (!order) throw new AppError("Order not found", 404);

  const resolvedPatientName = patientName || order.walkInPatient?.name || "Patient";

  const sample = await LabSample.create({
    order: order._id,
    lab: lab._id,
    patientName: resolvedPatientName,
    sampleType: sampleType || order.tests[0]?.sampleType || "N/A",
    notes: notes || "",
  });

  res.status(201).json(ok("Sample registered successfully", sample));
});

// PUT /api/lab/samples/:id
export const updateSample = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const lab = await getOwnLab(req);
  const sample = await LabSample.findOne({ _id: req.params.id, lab: lab._id });
  if (!sample) throw new AppError("Sample not found", 404);

  const { status, notes } = req.body;
  if (status) {
    sample.status = status;
    if (status === "Collected") sample.collectionDate = new Date();
    if (status === "Received") sample.receivedDate = new Date();

    // Keep the parent order status roughly in sync with the sample lifecycle.
    const order = await LabOrder.findById(sample.order);
    if (order) {
      if (status === "Collected") order.status = "Sample Collection";
      if (status === "Received") order.status = "Sample Received";
      if (status === "Processing") order.status = "Processing";
      await order.save();
      if (order.patient) {
        await notify(order.patient, "Sample status updated", `Your sample is now "${status}".`, "lab-sample");
      }
    }
  }
  if (notes !== undefined) sample.notes = notes;

  await sample.save();
  res.json(ok("Sample updated successfully", sample));
});

// ---------- REPORTS ----------

// GET /api/lab/reports
export const listReports = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const lab = await getOwnLab(req);
  const { status } = req.query as Record<string, string>;

  const filter: Record<string, unknown> = { lab: lab._id };
  if (status) filter.verificationStatus = status;

  const reports = await LabReport.find(filter).sort({ createdAt: -1 });
  res.json(ok("Reports fetched", reports));
});

// GET /api/lab/reports/:id
// Access is restricted to: the lab that owns it, the patient it belongs
// to, or the referring doctor - never publicly readable by ID alone,
// since a report contains real health information.
export const getReport = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const report = await LabReport.findById(req.params.id).populate("lab", "labName address city").populate("doctor", "name specialty");
  if (!report) throw new AppError("Report not found", 404);

  const userId = req.user!._id.toString();
  const isOwningLab = req.user!.role === "Lab" && (await Lab.exists({ _id: report.lab, user: req.user!._id }));
  const isPatient = report.patient?.toString() === userId;
  const isReferringDoctor =
    req.user!.role === "Doctor" && report.doctor && (await Doctor.exists({ _id: report.doctor, user: req.user!._id }));

  if (!isOwningLab && !isPatient && !isReferringDoctor) {
    throw new AppError("You don't have permission to view this report.", 403);
  }

  res.json(ok("Report fetched", report));
});

// POST /api/lab/reports (create draft from an order)
export const createReport = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const lab = await getOwnLab(req);
  const { orderId } = req.body;

  const order = await LabOrder.findOne({ _id: orderId, lab: lab._id });
  if (!order) throw new AppError("Order not found", 404);

  const existing = await LabReport.findOne({ order: order._id });
  if (existing) throw new AppError("A report already exists for this order", 400);

  const patientName = order.walkInPatient?.name || "Patient";

  const report = await LabReport.create({
    order: order._id,
    lab: lab._id,
    patient: order.patient || undefined,
    patientName,
    doctor: order.doctor || undefined,
    tests: order.tests.map((t) => ({ test: t.test, testName: t.name, parameters: [] })),
  });

  res.status(201).json(ok("Report draft created", report));
});

// PUT /api/lab/reports/:id (enter results / notes / technician / verify / publish)
export const updateReport = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const lab = await getOwnLab(req);
  const report = await LabReport.findOne({ _id: req.params.id, lab: lab._id });
  if (!report) throw new AppError("Report not found", 404);

  const { tests, technician, notes, verificationStatus, reportFileUrl } = req.body;

  if (tests) report.tests = tests;
  if (technician !== undefined) report.technician = technician;
  if (notes !== undefined) report.notes = notes;
  if (reportFileUrl !== undefined) report.reportFileUrl = reportFileUrl;

  if (verificationStatus) {
    report.verificationStatus = verificationStatus;

    if (verificationStatus === "Published") {
      report.publishedAt = new Date();

      await LabOrder.findByIdAndUpdate(report.order, { status: "Completed" });

      if (report.patient) {
        await notify(report.patient, "Lab report published", `Your report from ${lab.labName} is ready to view.`, "lab-report");
      }
    }
  }

  await report.save();
  res.json(ok("Report updated successfully", report));
});

// ---------- PATIENTS ----------

// GET /api/lab/patients
export const listLabPatients = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const lab = await getOwnLab(req);
  const { search } = req.query as Record<string, string>;

  const patientIds = await LabOrder.distinct("patient", { lab: lab._id, patient: { $ne: null } });

  const userFilter: Record<string, unknown> = { _id: { $in: patientIds } };
  if (search) {
    userFilter.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const patients = await User.find(userFilter).select("firstName lastName phone email");

  const enriched = await Promise.all(
    patients.map(async (p) => {
      const [orderCount, lastOrder, lastReport, currentOrders] = await Promise.all([
        LabOrder.countDocuments({ lab: lab._id, patient: p._id }),
        LabOrder.findOne({ lab: lab._id, patient: p._id }).sort({ createdAt: -1 }),
        LabReport.findOne({ lab: lab._id, patient: p._id, verificationStatus: "Published" }).sort({ publishedAt: -1 }),
        LabOrder.countDocuments({ lab: lab._id, patient: p._id, status: { $nin: ["Completed", "Cancelled"] } }),
      ]);
      return {
        ...p.toObject(),
        orderCount,
        lastTestDate: lastOrder?.createdAt || null,
        lastReportDate: lastReport?.publishedAt || null,
        currentOrders,
      };
    })
  );

  res.json(ok("Patients fetched", enriched));
});

// ---------- PROFILE ----------

// GET /api/lab/profile
export const getLabProfile = asyncHandler(async (req: AuthedRequest, res: Response) => {
  let lab = await Lab.findOne({ user: req.user!._id });
  if (!lab) {
    // Auto-provision a blank profile so a freshly-registered Lab account
    // always has something to edit, without requiring a seed step.
    lab = await Lab.create({
      user: req.user!._id,
      labName: `${req.user!.firstName} ${req.user!.lastName} Diagnostics`,
      email: req.user!.email,
      contactNumber: req.user!.phone,
    });
  }
  res.json(ok("Profile fetched", lab));
});

// PUT /api/lab/profile
export const updateLabProfile = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const lab = await getOwnLab(req);

  const allowed = [
    "labName",
    "registrationNumber",
    "contactNumber",
    "email",
    "address",
    "city",
    "operatingHours",
    "homeSampleCollection",
    "accreditation",
    "description",
  ];

  for (const field of allowed) {
    if (field in req.body) (lab as any)[field] = req.body[field];
  }

  await lab.save();
  res.json(ok("Profile updated successfully", lab));
});
