import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITimeRange {
  start: string; // "09:00"
  end: string; // "13:00"
}

export interface IWorkingDay {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  isAvailable: boolean;
  ranges: ITimeRange[];
}

export interface IDoctor extends Document {
  user: Types.ObjectId;
  name: string;
  profileImage: string;
  specialty: string;
  qualification: string;
  registrationNumber: string;
  experience: number;
  hospital: string;
  clinic: string;
  location: string;
  languages: string[];
  consultationFee: number;
  rating: number;
  reviewCount: number;
  about: string;
  consultationModes: string[]; // ["Online", "In-Person"]
  verificationStatus: "Pending" | "Verified";
  isActive: boolean;
  availability: {
    workingDays: IWorkingDay[];
    slotDuration: number; // minutes
  };
  createdAt: Date;
  updatedAt: Date;
}

const timeRangeSchema = new Schema<ITimeRange>(
  {
    start: { type: String, required: true },
    end: { type: String, required: true },
  },
  { _id: false }
);

const workingDaySchema = new Schema<IWorkingDay>(
  {
    day: {
      type: String,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      required: true,
    },
    isAvailable: { type: Boolean, default: false },
    ranges: { type: [timeRangeSchema], default: [] },
  },
  { _id: false }
);

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const doctorSchema = new Schema<IDoctor>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    name: { type: String, required: true, trim: true },
    profileImage: { type: String, default: "/doctor.png" },
    specialty: { type: String, required: true, index: true },
    qualification: { type: String, default: "" },
    registrationNumber: { type: String, default: "" },
    experience: { type: Number, default: 0, min: 0 },
    hospital: { type: String, default: "" },
    clinic: { type: String, default: "" },
    location: { type: String, default: "", index: true },
    languages: { type: [String], default: ["English"] },
    consultationFee: { type: Number, default: 500, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    about: { type: String, default: "" },
    consultationModes: { type: [String], default: ["Online", "In-Person"] },
    verificationStatus: { type: String, enum: ["Pending", "Verified"], default: "Verified" },
    isActive: { type: Boolean, default: true },
    availability: {
      workingDays: {
        type: [workingDaySchema],
        default: () => DAYS.map((day) => ({ day, isAvailable: false, ranges: [] })),
      },
      slotDuration: { type: Number, default: 30 },
    },
  },
  { timestamps: true }
);

doctorSchema.index({ name: "text", specialty: "text", hospital: "text", clinic: "text", location: "text" });

export default mongoose.model<IDoctor>("Doctor", doctorSchema);
