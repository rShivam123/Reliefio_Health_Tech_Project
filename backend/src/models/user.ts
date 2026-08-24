import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  isVerified: boolean;
 resetPasswordToken:string
 resetPasswordExpire:Date
  otp?: string | null;
    otpExpiry?: Date | null;
  // Optional patient-facing profile fields (only meaningful when role === "Patient")
  dateOfBirth?: Date | null;
  gender?: string | null;
  bloodGroup?: string | null;
  allergies?: string[];
  currentMedications?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    otp: {
        type: String,
        default: null,
     },

     otpExpiry: {
      type: Date,
      default: null,
    },

    resetPasswordToken:{
      type:String,
      default:null
      },

     resetPasswordExpire:{
      type:Date,
       default:null
      },

    role: {
      type: String,
      // "Hospital" retained for backward-compatibility; not used by the
      // Doctors/Physician/Lab modules. "Lab" represents lab staff accounts.
      enum: ["Doctor", "Patient", "Lab", "Hospital"],
      default: "Patient",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    dateOfBirth: { type: Date, default: null },
    gender: { type: String, default: null },
    bloodGroup: { type: String, default: null },
    allergies: { type: [String], default: [] },
    currentMedications: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", userSchema);