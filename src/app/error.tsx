"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

import { Button, Card, Container } from "@/components/ui";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Route-level error UI (App Router).
 * Nested feature trees can additionally use <ErrorBoundary />.
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[RouteError]", error);
  }, [error]);

  return (
    <Container className="flex min-h-[60vh] items-center justify-center py-16">
      <Card className="max-w-md text-center" padding="lg">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertTriangle className="size-6" aria-hidden />
        </div>
        <h1 className="text-xl font-semibold text-slate-900">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {error.message ||
            "An unexpected error occurred while loading this page."}
        </p>
        <Button className="mt-6" onClick={reset}>
          Try again
        </Button>
      </Card>
    </Container>
  );
}
