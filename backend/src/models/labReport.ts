import mongoose, { Schema, Document, Types } from "mongoose";

export type ReportVerificationStatus = "Draft" | "Processing" | "Pending Verification" | "Verified" | "Published";

export interface IResultParameter {
  parameter: string;
  result: string;
  unit: string;
  referenceRange: string;
  flag: "Normal" | "Low" | "High" | "Critical" | "";
}

export interface IReportTest {
  test: Types.ObjectId;
  testName: string;
  parameters: IResultParameter[];
}

export interface ILabReport extends Document {
  order: Types.ObjectId;
  lab: Types.ObjectId;
  patient?: Types.ObjectId;
  patientName: string;
  doctor?: Types.ObjectId;
  tests: IReportTest[];
  technician: string;
  verificationStatus: ReportVerificationStatus;
  notes: string;
  reportFileUrl?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const resultParameterSchema = new Schema<IResultParameter>(
  {
    parameter: { type: String, required: true },
    result: { type: String, default: "" },
    unit: { type: String, default: "" },
    referenceRange: { type: String, default: "" },
    flag: { type: String, enum: ["Normal", "Low", "High", "Critical", ""], default: "" },
  },
  { _id: false }
);

const reportTestSchema = new Schema<IReportTest>(
  {
    test: { type: Schema.Types.ObjectId, ref: "LabTest", required: true },
    testName: { type: String, required: true },
    parameters: { type: [resultParameterSchema], default: [] },
  },
  { _id: false }
);

const labReportSchema = new Schema<ILabReport>(
  {
    order: { type: Schema.Types.ObjectId, ref: "LabOrder", required: true, index: true },
    lab: { type: Schema.Types.ObjectId, ref: "Lab", required: true, index: true },
    patient: { type: Schema.Types.ObjectId, ref: "User" },
    patientName: { type: String, required: true },
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor" },
    tests: { type: [reportTestSchema], default: [] },
    technician: { type: String, default: "" },
    verificationStatus: {
      type: String,
      enum: ["Draft", "Processing", "Pending Verification", "Verified", "Published"],
      default: "Draft",
    },
    notes: { type: String, default: "" },
    reportFileUrl: { type: String, default: "" },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<ILabReport>("LabReport", labReportSchema);
