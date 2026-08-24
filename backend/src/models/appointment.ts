import mongoose, { Schema, Document, Types } from "mongoose";

export type AppointmentStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface IAppointment extends Document {
  patient: Types.ObjectId;
  doctor: Types.ObjectId;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM (24h)
  consultationType: "Online" | "In-Person";
  reason: string;
  notes: string;
  status: AppointmentStatus;
  paymentStatus: "Pending" | "Paid";
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    patient: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true, index: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    consultationType: { type: String, enum: ["Online", "In-Person"], default: "Online" },
    reason: { type: String, required: true },
    notes: { type: String, default: "" },
    status: { type: String, enum: ["Pending", "Confirmed", "Completed", "Cancelled"], default: "Pending" },
    paymentStatus: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
    cancellationReason: { type: String, default: "" },
  },
  { timestamps: true }
);

appointmentSchema.index({ doctor: 1, date: 1, time: 1 });

export default mongoose.model<IAppointment>("Appointment", appointmentSchema);
