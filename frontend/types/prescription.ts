export interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface Prescription {
  _id: string;
  patient: { _id: string; firstName: string; lastName: string } | string;
  doctor: { _id: string; name: string; specialty: string } | string;
  consultation: string;
  appointment?: string;
  medicines: Medicine[];
  date: string;
  createdAt: string;
}
