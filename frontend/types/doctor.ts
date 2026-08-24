export interface TimeRange {
  start: string;
  end: string;
}

export interface WorkingDay {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  isAvailable: boolean;
  ranges: TimeRange[];
}

export interface DoctorAvailability {
  workingDays: WorkingDay[];
  slotDuration: number;
}

export interface Doctor {
  _id: string;
  user: string;
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
  consultationModes: string[];
  verificationStatus: "Pending" | "Verified";
  isActive: boolean;
  availability: DoctorAvailability;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorFilters {
  search?: string;
  specialty?: string;
  location?: string;
  minExperience?: number;
  maxExperience?: number;
  consultationType?: string;
  minFee?: number;
  maxFee?: number;
  minRating?: number;
  sort?: "recommended" | "rating" | "experience" | "fee_low" | "fee_high";
  page?: number;
  limit?: number;
}

export interface Review {
  _id: string;
  patient: { _id: string; firstName: string; lastName: string };
  doctor: string;
  appointment: string;
  rating: number;
  comment: string;
  createdAt: string;
}
