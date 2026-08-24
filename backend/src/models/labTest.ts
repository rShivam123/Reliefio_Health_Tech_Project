import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITestParameter {
  name: string;
  unit: string;
  referenceRange: string;
}

export interface ILabTest extends Document {
  lab: Types.ObjectId;
  name: string;
  category: string;
  price: number;
  sampleType: string;
  turnaroundTime: string;
  preparationInstructions: string;
  parameters: ITestParameter[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const parameterSchema = new Schema<ITestParameter>(
  {
    name: { type: String, required: true },
    unit: { type: String, default: "" },
    referenceRange: { type: String, default: "" },
  },
  { _id: false }
);

const labTestSchema = new Schema<ILabTest>(
  {
    lab: { type: Schema.Types.ObjectId, ref: "Lab", required: true, index: true },
    name: { type: String, required: true },
    category: { type: String, default: "General" },
    price: { type: Number, required: true, min: 0 },
    sampleType: { type: String, required: true },
    turnaroundTime: { type: String, default: "24 hours" },
    preparationInstructions: { type: String, default: "No special preparation required." },
    parameters: { type: [parameterSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<ILabTest>("LabTest", labTestSchema);
