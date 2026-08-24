import mongoose, { Schema, Document, Types } from "mongoose";

export type LabOrderStatus =
  | "Pending"
  | "Sample Collection"
  | "Sample Received"
  | "Processing"
  | "Completed"
  | "Cancelled";

export interface IOrderedTest {
  test: Types.ObjectId;
  name: string;
  price: number;
  sampleType: string;
}

export interface IWalkInPatient {
  name: string;
  phone: string;
  age?: number;
  gender?: string;
}

export interface ILabOrder extends Document {
  patient?: Types.ObjectId;
  walkInPatient?: IWalkInPatient;
  doctor?: Types.ObjectId;
  lab: Types.ObjectId;
  tests: IOrderedTest[];
  totalAmount: number;
  status: LabOrderStatus;
  paymentStatus: "Pending" | "Paid";
  orderedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const orderedTestSchema = new Schema<IOrderedTest>(
  {
    test: { type: Schema.Types.ObjectId, ref: "LabTest", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    sampleType: { type: String, required: true },
  },
  { _id: false }
);

const walkInSchema = new Schema<IWalkInPatient>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    age: { type: Number },
    gender: { type: String },
  },
  { _id: false }
);

const labOrderSchema = new Schema<ILabOrder>(
  {
    patient: { type: Schema.Types.ObjectId, ref: "User" },
    walkInPatient: { type: walkInSchema },
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor" },
    lab: { type: Schema.Types.ObjectId, ref: "Lab", required: true, index: true },
    tests: { type: [orderedTestSchema], default: [] },
    totalAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Pending", "Sample Collection", "Sample Received", "Processing", "Completed", "Cancelled"],
      default: "Pending",
    },
    paymentStatus: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
    orderedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<ILabOrder>("LabOrder", labOrderSchema);
