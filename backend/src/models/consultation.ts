import mongoose, { Schema, Document, Types } from "mongoose";

export interface IConsultation extends Document {
  appointment: Types.ObjectId;
  patient: Types.ObjectId;
  doctor: Types.ObjectId;
  diagnosis: string;
  notes: string;
  status: "Draft" | "Completed";
  createdAt: Date;
  updatedAt: Date;
}

const consultationSchema = new Schema<IConsultation>(
  {
    appointment: { type: Schema.Types.ObjectId, ref: "Appointment", required: true, unique: true },
    patient: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true, index: true },
    diagnosis: { type: String, default: "" },
    notes: { type: String, default: "" },
    status: { type: String, enum: ["Draft", "Completed"], default: "Draft" },
  },
  { timestamps: true }
);

export default mongoose.model<IConsultation>("Consultation", consultationSchema);
