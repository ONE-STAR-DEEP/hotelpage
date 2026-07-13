import { z } from "zod";

/**
 * Server-side environment schema.
 * Secrets (API_KEY) must never use the NEXT_PUBLIC_ prefix.
 */
const serverEnvSchema = z.object({
  API_KEY: z.string().min(1, "API_KEY is required"),
  API_TIMEOUT_MS: z.coerce.number().positive().default(60_000),
});

/**
 * Client-safe environment schema.
 * Only NEXT_PUBLIC_* values are available in the browser.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_API_BASE_URL: z.string().url(),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

function getPublicEnv(): PublicEnv {
  const parsed = publicEnvSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  });

  if (!parsed.success) {
    throw new Error(
      `Invalid public environment variables:\n${parsed.error.message}`,
    );
  }

  return parsed.data;
}

/**
 * Validates and returns server-only env. Call only from server code.
 */
export function getServerEnv(): ServerEnv & PublicEnv {
  const publicEnv = getPublicEnv();

  const parsed = serverEnvSchema.safeParse({
    API_KEY: process.env.API_KEY || process.env.SEARCH_API_KEY,
    API_TIMEOUT_MS: process.env.API_TIMEOUT_MS,
  });

  if (!parsed.success) {
    throw new Error(
      `Invalid server environment variables:\n${parsed.error.message}`,
    );
  }

  return { ...publicEnv, ...parsed.data };
}

/**
 * Client-safe env accessors. Safe to import in Client Components.
 */
export const publicEnv = {
  get appUrl() {
    return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  },
  get apiBaseUrl() {
    return (
      process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.example.com"
    );
  },
} as const;
