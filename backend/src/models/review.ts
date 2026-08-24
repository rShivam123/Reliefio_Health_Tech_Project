import mongoose, { Schema, Document, Types } from "mongoose";

export interface IReview extends Document {
  patient: Types.ObjectId;
  doctor: Types.ObjectId;
  appointment: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    patient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true, index: true },
    appointment: { type: Schema.Types.ObjectId, ref: "Appointment", required: true, unique: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model<IReview>("Review", reviewSchema);
