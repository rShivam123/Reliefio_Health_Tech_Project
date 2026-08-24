/**
 * Development seed script.
 *
 * Populates MongoDB with realistic demo data so the /doctors, /physician
 * and /lab modules are usable immediately, without ever hardcoding
 * doctors/tests directly into the React components.
 *
 * Usage:
 *   npm run seed
 *
 * Safe to re-run: existing demo accounts (matched by email) are updated
 * in place rather than duplicated.
 */
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";

import User from "../models/user.js";
import Doctor, { IWorkingDay } from "../models/doctor.js";
import Lab from "../models/lab.js";
import LabTest from "../models/labTest.js";

const DEMO_PASSWORD = "Demo@1234";

const standardWeek = (activeDays: string[], start = "09:00", end = "17:00"): IWorkingDay[] => {
  const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  return allDays.map((day) => ({
    day: day as IWorkingDay["day"],
    isAvailable: activeDays.includes(day),
    ranges: activeDays.includes(day) ? [{ start, end }] : [],
  }));
};

const doctorSeeds = [
  {
    firstName: "Rahul",
    lastName: "Sharma",
    email: "rahul.sharma@reliefio.demo",
    phone: "9800000001",
    specialty: "Cardiologist",
    qualification: "MBBS, MD (Cardiology)",
    registrationNumber: "KMC-10234",
    experience: 12,
    hospital: "Reliefio Heart Institute",
    clinic: "Sharma Cardiac Clinic",
    location: "Bangalore",
    languages: ["English", "Hindi", "Kannada"],
    consultationFee: 900,
    about:
      "Dr. Rahul Sharma is a senior cardiologist with 12 years of experience in interventional cardiology, specializing in angioplasty and heart failure management.",
    consultationModes: ["Online", "In-Person"],
    workingDays: standardWeek(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "09:00", "13:00"),
  },
  {
    firstName: "Ananya",
    lastName: "Iyer",
    email: "ananya.iyer@reliefio.demo",
    phone: "9800000002",
    specialty: "Dermatologist",
    qualification: "MBBS, MD (Dermatology)",
    registrationNumber: "KMC-10891",
    experience: 8,
    hospital: "Reliefio Skin & Hair Clinic",
    clinic: "Iyer Skin Care",
    location: "Bangalore",
    languages: ["English", "Hindi", "Tamil"],
    consultationFee: 700,
    about: "Dr. Ananya Iyer treats acne, psoriasis, hair loss and cosmetic dermatology concerns with a patient-first approach.",
    consultationModes: ["Online", "In-Person"],
    workingDays: standardWeek(["Monday", "Wednesday", "Friday", "Saturday"], "10:00", "18:00"),
  },
  {
    firstName: "Vikram",
    lastName: "Nair",
    email: "vikram.nair@reliefio.demo",
    phone: "9800000003",
    specialty: "Orthopedic",
    qualification: "MBBS, MS (Orthopedics)",
    registrationNumber: "KMC-11023",
    experience: 15,
    hospital: "Reliefio Bone & Joint Center",
    clinic: "",
    location: "Mumbai",
    languages: ["English", "Hindi", "Malayalam"],
    consultationFee: 1000,
    about: "Dr. Vikram Nair specializes in joint replacement surgery and sports injury management.",
    consultationModes: ["In-Person"],
    workingDays: standardWeek(["Tuesday", "Thursday", "Saturday"], "11:00", "19:00"),
  },
  {
    firstName: "Priya",
    lastName: "Desai",
    email: "priya.desai@reliefio.demo",
    phone: "9800000004",
    specialty: "Gynecologist",
    qualification: "MBBS, MD (Obstetrics & Gynecology)",
    registrationNumber: "KMC-11456",
    experience: 10,
    hospital: "Reliefio Women's Health Center",
    clinic: "Desai Women's Clinic",
    location: "Pune",
    languages: ["English", "Hindi", "Marathi"],
    consultationFee: 800,
    about: "Dr. Priya Desai provides comprehensive women's health care including prenatal care, fertility counselling and minimally invasive gynecological surgery.",
    consultationModes: ["Online", "In-Person"],
    workingDays: standardWeek(["Monday", "Tuesday", "Thursday", "Friday"], "09:30", "16:30"),
  },
  {
    firstName: "Arjun",
    lastName: "Mehta",
    email: "arjun.mehta@reliefio.demo",
    phone: "9800000005",
    specialty: "Neurologist",
    qualification: "MBBS, DM (Neurology)",
    registrationNumber: "KMC-11789",
    experience: 14,
    hospital: "Reliefio Neuro Sciences Institute",
    clinic: "",
    location: "Delhi",
    languages: ["English", "Hindi"],
    consultationFee: 1200,
    about: "Dr. Arjun Mehta is a consultant neurologist focused on stroke care, epilepsy and headache disorders.",
    consultationModes: ["Online"],
    workingDays: standardWeek(["Monday", "Wednesday", "Friday"], "14:00", "20:00"),
  },
  {
    firstName: "Sneha",
    lastName: "Reddy",
    email: "sneha.reddy@reliefio.demo",
    phone: "9800000006",
    specialty: "Pediatrician",
    qualification: "MBBS, MD (Pediatrics)",
    registrationNumber: "KMC-12034",
    experience: 9,
    hospital: "Reliefio Children's Hospital",
    clinic: "Reddy Child Clinic",
    location: "Hyderabad",
    languages: ["English", "Hindi", "Telugu"],
    consultationFee: 600,
    about: "Dr. Sneha Reddy provides pediatric primary care, vaccinations and developmental assessments for infants through teens.",
    consultationModes: ["Online", "In-Person"],
    workingDays: standardWeek(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], "08:00", "12:00"),
  },
  {
    firstName: "Karan",
    lastName: "Malhotra",
    email: "karan.malhotra@reliefio.demo",
    phone: "9800000007",
    specialty: "Psychiatrist",
    qualification: "MBBS, MD (Psychiatry)",
    registrationNumber: "KMC-12456",
    experience: 7,
    hospital: "Reliefio Mind Wellness Center",
    clinic: "",
    location: "Bangalore",
    languages: ["English", "Hindi", "Punjabi"],
    consultationFee: 850,
    about: "Dr. Karan Malhotra offers confidential, evidence-based care for anxiety, depression and stress-related conditions.",
    consultationModes: ["Online"],
    workingDays: standardWeek(["Tuesday", "Wednesday", "Thursday", "Saturday"], "17:00", "21:00"),
  },
  {
    firstName: "Meera",
    lastName: "Krishnan",
    email: "meera.krishnan@reliefio.demo",
    phone: "9800000008",
    specialty: "General Physician",
    qualification: "MBBS, MD (General Medicine)",
    registrationNumber: "KMC-12678",
    experience: 6,
    hospital: "Reliefio Primary Care Clinic",
    clinic: "Krishnan Family Clinic",
    location: "Chennai",
    languages: ["English", "Tamil"],
    consultationFee: 500,
    about: "Dr. Meera Krishnan is a general physician managing everyday illnesses, chronic disease follow-ups and preventive health check-ups.",
    consultationModes: ["Online", "In-Person"],
    workingDays: standardWeek(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "09:00", "17:00"),
  },
];

const labTestSeeds = [
  { name: "Complete Blood Count (CBC)", category: "Hematology", price: 450, sampleType: "Blood", turnaroundTime: "6 hours", preparationInstructions: "No special preparation required." },
  { name: "Lipid Profile", category: "Biochemistry", price: 700, sampleType: "Blood", turnaroundTime: "12 hours", preparationInstructions: "12-hour fasting required." },
  { name: "Thyroid Profile (T3, T4, TSH)", category: "Hormone", price: 600, sampleType: "Blood", turnaroundTime: "24 hours", preparationInstructions: "No special preparation required." },
  { name: "Fasting Blood Sugar", category: "Biochemistry", price: 150, sampleType: "Blood", turnaroundTime: "4 hours", preparationInstructions: "8-hour fasting required." },
  { name: "HbA1c", category: "Biochemistry", price: 500, sampleType: "Blood", turnaroundTime: "24 hours", preparationInstructions: "No special preparation required." },
  { name: "Liver Function Test (LFT)", category: "Biochemistry", price: 650, sampleType: "Blood", turnaroundTime: "12 hours", preparationInstructions: "8-hour fasting recommended." },
  { name: "Kidney Function Test (KFT)", category: "Biochemistry", price: 600, sampleType: "Blood", turnaroundTime: "12 hours", preparationInstructions: "No special preparation required." },
  { name: "Urine Routine Examination", category: "Pathology", price: 200, sampleType: "Urine", turnaroundTime: "6 hours", preparationInstructions: "First morning sample preferred." },
  { name: "COVID-19 RT-PCR", category: "Molecular", price: 800, sampleType: "Nasal/Throat Swab", turnaroundTime: "24 hours", preparationInstructions: "No special preparation required." },
  { name: "Vitamin D (25-OH)", category: "Hormone", price: 1200, sampleType: "Blood", turnaroundTime: "48 hours", preparationInstructions: "No special preparation required." },
];

async function seed() {
  await connectDB();
  console.log("Connected. Seeding demo data...\n");

  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

  // ---------- Doctors ----------
  const createdDoctorLogins: string[] = [];

  for (const d of doctorSeeds) {
    let user = await User.findOne({ email: d.email });
    if (!user) {
      user = await User.create({
        firstName: d.firstName,
        lastName: d.lastName,
        email: d.email,
        phone: d.phone,
        password: hashedPassword,
        role: "Doctor",
        isVerified: true,
      });
    }

    await Doctor.findOneAndUpdate(
      { user: user._id },
      {
        user: user._id,
        name: `Dr. ${d.firstName} ${d.lastName}`,
        specialty: d.specialty,
        qualification: d.qualification,
        registrationNumber: d.registrationNumber,
        experience: d.experience,
        hospital: d.hospital,
        clinic: d.clinic,
        location: d.location,
        languages: d.languages,
        consultationFee: d.consultationFee,
        about: d.about,
        consultationModes: d.consultationModes,
        verificationStatus: "Verified",
        isActive: true,
        availability: { workingDays: d.workingDays, slotDuration: 30 },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    createdDoctorLogins.push(d.email);
  }

  console.log(`Seeded ${doctorSeeds.length} doctors.`);

  // ---------- Lab ----------
  let labUser = await User.findOne({ email: "lab@reliefio.demo" });
  if (!labUser) {
    labUser = await User.create({
      firstName: "Reliefio",
      lastName: "Diagnostics",
      email: "lab@reliefio.demo",
      phone: "9800000099",
      password: hashedPassword,
      role: "Lab",
      isVerified: true,
    });
  }

  const lab = await Lab.findOneAndUpdate(
    { user: labUser._id },
    {
      user: labUser._id,
      labName: "Reliefio Diagnostics Center",
      registrationNumber: "LAB-REG-88123",
      contactNumber: "9800000099",
      email: "lab@reliefio.demo",
      address: "12 MG Road",
      city: "Bangalore",
      operatingHours: "7:00 AM - 9:00 PM (Mon-Sat)",
      homeSampleCollection: true,
      accreditation: "NABL Accredited",
      description: "A full-service diagnostic lab offering pathology, radiology and molecular testing with home sample collection.",
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log("Seeded 1 lab (Reliefio Diagnostics Center).");

  // ---------- Lab Tests ----------
  for (const t of labTestSeeds) {
    await LabTest.findOneAndUpdate(
      { lab: lab._id, name: t.name },
      { lab: lab._id, ...t, isActive: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log(`Seeded ${labTestSeeds.length} lab tests.`);

  // ---------- Demo Patient ----------
  let patient = await User.findOne({ email: "patient@reliefio.demo" });
  if (!patient) {
    patient = await User.create({
      firstName: "Demo",
      lastName: "Patient",
      email: "patient@reliefio.demo",
      phone: "9800000100",
      password: hashedPassword,
      role: "Patient",
      isVerified: true,
    });
  }

  console.log("Seeded 1 demo patient.\n");

  console.log("========================================");
  console.log(" DEMO LOGIN CREDENTIALS (password for all)");
  console.log(` Password: ${DEMO_PASSWORD}`);
  console.log("----------------------------------------");
  console.log(" Patient login : patient@reliefio.demo");
  console.log(" Lab login     : lab@reliefio.demo");
  console.log(" Doctor logins :");
  createdDoctorLogins.forEach((e) => console.log("   - " + e));
  console.log("========================================\n");

  await mongoose.disconnect();
  console.log("Done. Disconnected from MongoDB.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
