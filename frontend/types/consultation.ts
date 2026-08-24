export interface Consultation {
  _id: string;
  appointment: string;
  patient: string;
  doctor: string;
  diagnosis: string;
  notes: string;
  status: "Draft" | "Completed";
  createdAt: string;
  updatedAt: string;
}
