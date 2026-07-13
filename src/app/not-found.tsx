import Link from "next/link";

import { MainLayout } from "@/components/layout";
import { Container } from "@/components/ui";
import { ROUTES } from "@/constants";

export default function NotFound() {
  return (
    <MainLayout>
      <Container className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600">
          404
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-3 max-w-md text-slate-500">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href={ROUTES.home}
          className="mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-primary-600 px-5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          Back to home
        </Link>
      </Container>
    </MainLayout>
  );
}
