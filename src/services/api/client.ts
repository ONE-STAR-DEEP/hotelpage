import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

import type { ApiError, ApiErrorCode } from "@/types";

/**
 * Browser → same-origin BFF (`/api/...`).
 * Avoid hardcoding localhost:3000 — the app may run on 3001/3002 when 3000 is busy.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: "",
  timeout: 60_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: unknown) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(normalizeApiError(error)),
);

function mapStatusToCode(status?: number): ApiErrorCode {
  if (!status) return "NETWORK_ERROR";
  if (status === 401) return "UNAUTHORIZED";
  if (status === 403) return "FORBIDDEN";
  if (status === 404) return "NOT_FOUND";
  if (status === 422 || status === 400) return "VALIDATION_ERROR";
  if (status >= 500) return "SERVER_ERROR";
  return "UNKNOWN";
}

export function normalizeApiError(error: AxiosError): ApiError {
  if (error.code === "ECONNABORTED") {
    return {
      code: "TIMEOUT",
      message: "The request timed out. Please try again.",
    };
  }

  if (!error.response) {
    return {
      code: "NETWORK_ERROR",
      message: "Unable to reach the server. Check your connection.",
    };
  }

  const status = error.response.status;
  const data = error.response.data as { message?: string } | undefined;

  return {
    code: mapStatusToCode(status),
    message: data?.message ?? error.message ?? "Something went wrong.",
    status,
    details: error.response.data,
  };
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error
  );
}
