export class ApiResponse {
  success: boolean;
  message: string;
  data?: unknown;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  constructor(
    success: boolean,
    message: string,
    data?: unknown,
    pagination?: { page: number; limit: number; total: number; totalPages: number }
  ) {
    this.success = success;
    this.message = message;
    if (data !== undefined) this.data = data;
    if (pagination !== undefined) this.pagination = pagination;
  }
}

export const ok = (message: string, data?: unknown) =>
  new ApiResponse(true, message, data);

export const okPaginated = (
  message: string,
  data: unknown,
  page: number,
  limit: number,
  total: number
) => new ApiResponse(true, message, data, { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) });
