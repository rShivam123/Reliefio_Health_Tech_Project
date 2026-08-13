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
      enum: ["Doctor", "Patient", "Hospital"],
      default: "Patient",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", userSchema);