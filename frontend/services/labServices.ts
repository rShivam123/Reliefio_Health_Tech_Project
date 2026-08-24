import api from "../lib/axios";
import { ApiResponse } from "@/types/common";
import { Lab, LabTest, LabOrder, LabSample, LabReport, LabPatient } from "@/types/lab";

export interface LabDashboard {
  labName: string;
  totalOrders: number;
  pendingSamples: number;
  processing: number;
  reportsPending: number;
  reportsCompleted: number;
  todaysRevenue: number;
  recentOrders: LabOrder[];
  recentReports: LabReport[];
}

export const getLabDashboard = async (): Promise<ApiResponse<LabDashboard>> => {
  const res = await api.get("/lab/dashboard");
  return res.data;
};

// Tests
export const getLabTests = async (search?: string): Promise<ApiResponse<LabTest[]>> => {
  const res = await api.get("/lab/tests", { params: search ? { search } : undefined });
  return res.data;
};

export const createLabTest = async (payload: Partial<LabTest>) => {
  const res = await api.post("/lab/tests", payload);
  return res.data;
};

export const updateLabTest = async (id: string, payload: Partial<LabTest>) => {
  const res = await api.put(`/lab/tests/${id}`, payload);
  return res.data;
};

export const deleteLabTest = async (id: string) => {
  const res = await api.delete(`/lab/tests/${id}`);
  return res.data;
};

// Orders
export const getLabOrders = async (params?: { status?: string; search?: string }): Promise<ApiResponse<LabOrder[]>> => {
  const res = await api.get("/lab/orders", { params });
  return res.data;
};

export const getLabOrderById = async (id: string): Promise<ApiResponse<LabOrder>> => {
  const res = await api.get(`/lab/orders/${id}`);
  return res.data;
};

export const createLabOrder = async (payload: {
  patientId?: string;
  walkInPatient?: { name: string; phone: string; age?: number; gender?: string };
  doctorId?: string;
  testIds: string[];
}) => {
  const res = await api.post("/lab/orders", payload);
  return res.data;
};

export const updateLabOrder = async (id: string, payload: { status?: string; paymentStatus?: string }) => {
  const res = await api.put(`/lab/orders/${id}`, payload);
  return res.data;
};

// Samples
export const getLabSamples = async (status?: string): Promise<ApiResponse<LabSample[]>> => {
  const res = await api.get("/lab/samples", { params: status ? { status } : undefined });
  return res.data;
};

export const createLabSample = async (payload: { orderId: string; patientName?: string; sampleType?: string; notes?: string }) => {
  const res = await api.post("/lab/samples", payload);
  return res.data;
};

export const updateLabSample = async (id: string, payload: { status?: string; notes?: string }) => {
  const res = await api.put(`/lab/samples/${id}`, payload);
  return res.data;
};

// Reports
export const getLabReports = async (status?: string): Promise<ApiResponse<LabReport[]>> => {
  const res = await api.get("/lab/reports", { params: status ? { status } : undefined });
  return res.data;
};

export const getLabReportById = async (id: string): Promise<ApiResponse<LabReport>> => {
  const res = await api.get(`/lab/reports/${id}`);
  return res.data;
};

export const createLabReport = async (orderId: string) => {
  const res = await api.post("/lab/reports", { orderId });
  return res.data;
};

export const updateLabReport = async (id: string, payload: Partial<LabReport>) => {
  const res = await api.put(`/lab/reports/${id}`, payload);
  return res.data;
};

// Patients
export const getLabPatients = async (search?: string): Promise<ApiResponse<LabPatient[]>> => {
  const res = await api.get("/lab/patients", { params: search ? { search } : undefined });
  return res.data;
};

// Profile
export const getLabProfile = async (): Promise<ApiResponse<Lab>> => {
  const res = await api.get("/lab/profile");
  return res.data;
};

export const updateLabProfile = async (payload: Partial<Lab>) => {
  const res = await api.put("/lab/profile", payload);
  return res.data;
};

// Public tests (for patients self-ordering, or reference)
export const getPublicLabTests = async (labId?: string): Promise<ApiResponse<LabTest[]>> => {
  const res = await api.get("/lab/tests/public", { params: labId ? { labId } : undefined });
  return res.data;
};

export interface MyLabOrder extends LabOrder {
  report: { _id: string; verificationStatus: string } | null;
}

export const getMyLabOrders = async (): Promise<ApiResponse<MyLabOrder[]>> => {
  const res = await api.get("/lab/my-orders");
  return res.data;
};

export interface PatientSearchResult {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export const searchLabPatients = async (q: string): Promise<ApiResponse<PatientSearchResult[]>> => {
  const res = await api.get("/lab/patients/search", { params: { q } });
  return res.data;
};
