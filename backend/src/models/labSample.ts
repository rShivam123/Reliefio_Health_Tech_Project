import mongoose, { Schema, Document, Types } from "mongoose";

export type SampleStatus = "Pending" | "Collected" | "Received" | "Rejected" | "Processing" | "Completed";

export interface ILabSample extends Document {
  order: Types.ObjectId;
  lab: Types.ObjectId;
  patientName: string;
  sampleType: string;
  status: SampleStatus;
  collectionDate?: Date;
  receivedDate?: Date;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const labSampleSchema = new Schema<ILabSample>(
  {
    order: { type: Schema.Types.ObjectId, ref: "LabOrder", required: true, index: true },
    lab: { type: Schema.Types.ObjectId, ref: "Lab", required: true, index: true },
    patientName: { type: String, required: true },
    sampleType: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Collected", "Received", "Rejected", "Processing", "Completed"],
      default: "Pending",
    },
    collectionDate: { type: Date },
    receivedDate: { type: Date },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model<ILabSample>("LabSample", labSampleSchema);
