export interface Lab {
  _id: string;
  user: string;
  labName: string;
  registrationNumber: string;
  contactNumber: string;
  email: string;
  address: string;
  city: string;
  operatingHours: string;
  homeSampleCollection: boolean;
  accreditation: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface TestParameter {
  name: string;
  unit: string;
  referenceRange: string;
}

export interface LabTest {
  _id: string;
  lab: string;
  name: string;
  category: string;
  price: number;
  sampleType: string;
  turnaroundTime: string;
  preparationInstructions: string;
  parameters: TestParameter[];
  isActive: boolean;
  createdAt: string;
}

export type LabOrderStatus = "Pending" | "Sample Collection" | "Sample Received" | "Processing" | "Completed" | "Cancelled";

export interface OrderedTest {
  test: string;
  name: string;
  price: number;
  sampleType: string;
}

export interface WalkInPatient {
  name: string;
  phone: string;
  age?: number;
  gender?: string;
}

export interface LabOrder {
  _id: string;
  patient?: { _id: string; firstName: string; lastName: string; phone?: string; email?: string } | string;
  walkInPatient?: WalkInPatient;
  doctor?: { _id: string; name: string; specialty: string } | string;
  lab: string | { _id: string; labName: string; city: string };
  tests: OrderedTest[];
  totalAmount: number;
  status: LabOrderStatus;
  paymentStatus: "Pending" | "Paid";
  orderedAt: string;
  createdAt: string;
}

export type SampleStatus = "Pending" | "Collected" | "Received" | "Rejected" | "Processing" | "Completed";

export interface LabSample {
  _id: string;
  order: string | { _id: string; totalAmount: number; status: string };
  lab: string;
  patientName: string;
  sampleType: string;
  status: SampleStatus;
  collectionDate?: string;
  receivedDate?: string;
  notes: string;
  createdAt: string;
}

export type ReportVerificationStatus = "Draft" | "Processing" | "Pending Verification" | "Verified" | "Published";

export interface ResultParameter {
  parameter: string;
  result: string;
  unit: string;
  referenceRange: string;
  flag: "Normal" | "Low" | "High" | "Critical" | "";
}

export interface ReportTest {
  test: string;
  testName: string;
  parameters: ResultParameter[];
}

export interface LabReport {
  _id: string;
  order: string;
  lab: string | { _id: string; labName: string; address: string; city: string };
  patient?: string;
  patientName: string;
  doctor?: string | { _id: string; name: string; specialty: string };
  tests: ReportTest[];
  technician: string;
  verificationStatus: ReportVerificationStatus;
  notes: string;
  reportFileUrl?: string;
  publishedAt?: string;
  createdAt: string;
}

export interface LabPatient {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  orderCount: number;
  lastTestDate: string | null;
  lastReportDate: string | null;
  currentOrders: number;
}
