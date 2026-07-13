import Link from "next/link";

import { Button, Container } from "@/components/ui";
import { ROUTES } from "@/constants";

/**
 * Detail pages are outside the assignment scope (list/search only).
 * Cards link out to the hotel's own site when SearchAPI provides a URL.
 */
export default function HotelDetailPage() {
  return (
    <Container className="flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Hotel details</h1>
      <p className="mt-3 max-w-md text-sm text-slate-500">
        This assignment focuses on search results from SearchAPI Google Hotels.
        Open a hotel from the results list to visit its booking page when a link
        is available.
      </p>
      <Link href={ROUTES.search} className="mt-6">
        <Button>Back to search</Button>
      </Link>
    </Container>
  );
}
