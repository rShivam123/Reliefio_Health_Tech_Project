export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CurrentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "Doctor" | "Patient" | "Hospital" | "Lab";
  isVerified: boolean;
}
