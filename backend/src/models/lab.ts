import mongoose, { Schema, Document, Types } from "mongoose";

export interface ILab extends Document {
  user: Types.ObjectId;
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
  createdAt: Date;
  updatedAt: Date;
}

const labSchema = new Schema<ILab>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    labName: { type: String, required: true },
    registrationNumber: { type: String, default: "" },
    contactNumber: { type: String, default: "" },
    email: { type: String, default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "", index: true },
    operatingHours: { type: String, default: "9:00 AM - 8:00 PM" },
    homeSampleCollection: { type: Boolean, default: true },
    accreditation: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model<ILab>("Lab", labSchema);
