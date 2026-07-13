"use client";

import Link from "next/link";
import { Building2, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { APP_NAME, ROUTES } from "@/constants";
import { Button, Container } from "@/components/ui";
import { cn } from "@/utils";

const navLinks = [
  { href: ROUTES.home, label: "Home" },
  { href: ROUTES.search, label: "Explore" },
] as const;

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href={ROUTES.home}
          className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
            <Building2 className="size-5" aria-hidden />
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            {APP_NAME}
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Primary"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors",
                "hover:bg-slate-100 hover:text-slate-900",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link href={ROUTES.home}>
            <Button size="sm">Find stays</Button>
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-xl text-slate-700 transition-colors hover:bg-slate-100 md:hidden"
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </Container>

      <AnimatePresence>
        {isOpen ? (
          <motion.nav
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-slate-200/70 md:hidden"
            aria-label="Mobile"
          >
            <Container className="flex flex-col gap-1 py-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                >
                  {link.label}
                </Link>
              ))}
              <Link href={ROUTES.home} onClick={() => setIsOpen(false)}>
                <Button fullWidth className="mt-2">
                  Find stays
                </Button>
              </Link>
            </Container>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
