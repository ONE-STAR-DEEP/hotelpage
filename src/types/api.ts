/**
 * Shared API contract types.
 * Domain models (Hotel, SearchParams) will be added in later phases.
 */

export type ApiErrorCode =
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "SERVER_ERROR"
  | "UNKNOWN";

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  status?: number;
  details?: unknown;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export type AsyncStatus = "idle" | "loading" | "success" | "error";
