"use client";

import { AlertTriangle } from "lucide-react";

import { Button, Card } from "@/components/ui";
import type { ApiError } from "@/types";

export interface HotelErrorStateProps {
  error: ApiError;
  onRetry?: () => void;
}

export function HotelErrorState({ error, onRetry }: HotelErrorStateProps) {
  return (
    <Card className="flex flex-col items-center py-14 text-center" padding="lg">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-red-50 text-red-600">
        <AlertTriangle className="size-6" aria-hidden />
      </div>
      <h2 className="text-lg font-semibold text-slate-900">Search failed</h2>
      <p className="mt-2 max-w-md text-sm text-slate-500">{error.message}</p>
      {onRetry ? (
        <Button className="mt-6" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </Card>
  );
}
