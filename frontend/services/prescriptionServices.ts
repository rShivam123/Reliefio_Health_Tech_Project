import api from "../lib/axios";
import { ApiResponse } from "@/types/common";
import { Prescription, Medicine } from "@/types/prescription";

export const createPrescription = async (payload: {
  patientId: string;
  consultationId: string;
  appointmentId?: string;
  medicines: Medicine[];
}): Promise<ApiResponse<Prescription>> => {
  const res = await api.post("/prescriptions", payload);
  return res.data;
};

export const getPrescriptionsForPatient = async (patientId: string): Promise<ApiResponse<Prescription[]>> => {
  const res = await api.get(`/prescriptions/patient/${patientId}`);
  return res.data;
};

export const getMyPrescriptions = async (search?: string): Promise<ApiResponse<Prescription[]>> => {
  const res = await api.get("/prescriptions/mine", { params: search ? { search } : undefined });
  return res.data;
};
