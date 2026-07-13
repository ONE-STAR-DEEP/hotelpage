import { SearchX } from "lucide-react";

import { Card } from "@/components/ui";

export interface HotelEmptyStateProps {
  destination?: string;
}

export function HotelEmptyState({ destination }: HotelEmptyStateProps) {
  return (
    <Card className="flex flex-col items-center py-14 text-center" padding="lg">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <SearchX className="size-6" aria-hidden />
      </div>
      <h2 className="text-lg font-semibold text-slate-900">No stays found</h2>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        {destination
          ? `We couldn’t find hotels matching “${destination}”. Try another city like Paris, Tokyo, or Bali.`
          : "Try searching for a city like Paris, London, or New York."}
      </p>
    </Card>
  );
}
