import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMedicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface IPrescription extends Document {
  patient: Types.ObjectId;
  doctor: Types.ObjectId;
  consultation: Types.ObjectId;
  appointment?: Types.ObjectId;
  medicines: IMedicine[];
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const medicineSchema = new Schema<IMedicine>(
  {
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true },
    instructions: { type: String, default: "" },
  },
  { _id: false }
);

const prescriptionSchema = new Schema<IPrescription>(
  {
    patient: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true, index: true },
    consultation: { type: Schema.Types.ObjectId, ref: "Consultation", required: true },
    appointment: { type: Schema.Types.ObjectId, ref: "Appointment" },
    medicines: { type: [medicineSchema], default: [] },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IPrescription>("Prescription", prescriptionSchema);
