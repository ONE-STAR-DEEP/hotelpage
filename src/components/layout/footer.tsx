import Link from "next/link";
import { Building2 } from "lucide-react";

import { APP_NAME, ROUTES } from "@/constants";
import { Container } from "@/components/ui";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-slate-50">
      <Container className="flex flex-col gap-8 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary-600 text-white">
              <Building2 className="size-4" aria-hidden />
            </span>
            <span className="font-semibold text-slate-900">{APP_NAME}</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-500">
            Premium hotel discovery for travelers who value comfort, clarity,
            and beautiful stays.
          </p>
        </div>

        <nav aria-label="Footer" className="flex gap-10 text-sm">
          <div className="space-y-2">
            <p className="font-medium text-slate-900">Explore</p>
            <ul className="space-y-1.5 text-slate-500">
              <li>
                <Link
                  href={ROUTES.home}
                  className="transition-colors hover:text-primary-600"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.search}
                  className="transition-colors hover:text-primary-600"
                >
                  Search hotels
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </Container>

      <div className="border-t border-slate-200/80">
        <Container className="py-4">
          <p className="text-center text-xs text-slate-400 sm:text-left">
            © {year} {APP_NAME}. All rights reserved.
          </p>
        </Container>
      </div>
    </footer>
  );
}
