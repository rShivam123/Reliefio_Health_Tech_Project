"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/Components/shared/Skeleton";
import { useToast } from "@/Components/shared/ToastProvider";
import { useAuth } from "@/Components/shared/AuthProvider";
import { getPhysicianProfile, updatePhysicianProfile } from "@/services/physicianServices";
import { createDoctorProfile } from "@/services/doctorServices";
import { Doctor } from "@/types/doctor";

const SPECIALTIES = [
  "General Physician",
  "Cardiologist",
  "Dermatologist",
  "Neurologist",
  "Orthopedic",
  "Pediatrician",
  "Gynecologist",
  "Psychiatrist",
  "ENT Specialist",
  "Dentist",
  "Ophthalmologist",
];

interface FormState {
  name: string;
  specialty: string;
  qualification: string;
  registrationNumber: string;
  experience: number;
  hospital: string;
  clinic: string;
  location: string;
  languages: string;
  consultationFee: number;
  about: string;
  consultationModes: string[];
}

const emptyForm = (fallbackName: string): FormState => ({
  name: fallbackName,
  specialty: "",
  qualification: "",
  registrationNumber: "",
  experience: 0,
  hospital: "",
  clinic: "",
  location: "",
  languages: "English",
  consultationFee: 500,
  about: "",
  consultationModes: ["Online", "In-Person"],
});

export default function PhysicianProfilePage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm(""));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getPhysicianProfile()
      .then((res) => {
        if (res.data) {
          const d = res.data;
          setDoctor(d);
          setForm({
            name: d.name,
            specialty: d.specialty,
            qualification: d.qualification,
            registrationNumber: d.registrationNumber,
            experience: d.experience,
            hospital: d.hospital,
            clinic: d.clinic,
            location: d.location,
            languages: d.languages.join(", "),
            consultationFee: d.consultationFee,
            about: d.about,
            consultationModes: d.consultationModes,
          });
        } else if (user) {
          setForm(emptyForm(`Dr. ${user.firstName} ${user.lastName}`));
        }
      })
      .finally(() => setLoading(false));
  }, [user]);

  const toggleMode = (mode: string) => {
    setForm((f) => ({
      ...f,
      consultationModes: f.consultationModes.includes(mode)
        ? f.consultationModes.filter((m) => m !== mode)
        : [...f.consultationModes, mode],
    }));
  };

  const handleSave = async () => {
    if (!form.specialty) {
      showToast("Specialty is required.", "error");
      return;
    }

    const payload = {
      name: form.name,
      specialty: form.specialty,
      qualification: form.qualification,
      registrationNumber: form.registrationNumber,
      experience: Number(form.experience),
      hospital: form.hospital,
      clinic: form.clinic,
      location: form.location,
      languages: form.languages.split(",").map((l) => l.trim()).filter(Boolean),
      consultationFee: Number(form.consultationFee),
      about: form.about,
      consultationModes: form.consultationModes,
    };

    try {
      setSaving(true);
      if (doctor) {
        const res = await updatePhysicianProfile(payload);
        setDoctor(res.data);
        showToast("Profile updated successfully.", "success");
      } else {
        const res = await createDoctorProfile(payload);
        setDoctor(res.data);
        showToast("Profile created successfully.", "success");
      }
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to save profile.";
      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">{doctor ? "Profile" : "Complete Your Profile"}</h1>
      <p className="text-gray-500 mt-1">
        {doctor
          ? "Keep your professional details up to date - patients see this information."
          : "Set up your professional profile so patients can find and book you."}
      </p>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Specialty *</label>
            <select
              value={form.specialty}
              onChange={(e) => setForm({ ...form, specialty: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select specialty</option>
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
            <input
              value={form.qualification}
              onChange={(e) => setForm({ ...form, qualification: e.target.value })}
              placeholder="e.g. MBBS, MD"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
            <input
              value={form.registrationNumber}
              onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
            <input
              type="number"
              min={0}
              value={form.experience}
              onChange={(e) => setForm({ ...form, experience: Number(e.target.value) })}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hospital</label>
            <input
              value={form.hospital}
              onChange={(e) => setForm({ ...form, hospital: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Clinic</label>
            <input
              value={form.clinic}
              onChange={(e) => setForm({ ...form, clinic: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="City"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee (₹)</label>
            <input
              type="number"
              min={0}
              value={form.consultationFee}
              onChange={(e) => setForm({ ...form, consultationFee: Number(e.target.value) })}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Languages (comma separated)</label>
          <input
            value={form.languages}
            onChange={(e) => setForm({ ...form, languages: e.target.value })}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
          <textarea
            value={form.about}
            onChange={(e) => setForm({ ...form, about: e.target.value })}
            rows={3}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Modes</label>
          <div className="flex gap-2">
            {["Online", "In-Person"].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => toggleMode(mode)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                  form.consultationModes.includes(mode)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-semibold transition"
        >
          {saving ? "Saving..." : doctor ? "Save Changes" : "Create Profile"}
        </button>
      </div>
    </div>
  );
}
