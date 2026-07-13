import type { ReactNode } from "react";

import { MainLayout } from "@/components/layout";

/**
 * Route group layout — applies the shared application chrome
 * without affecting the URL structure.
 */
export default function MainGroupLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <MainLayout>{children}</MainLayout>;
}
