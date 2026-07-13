import type { ReactNode } from "react";

import { Footer } from "./footer";
import { Header } from "./header";

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * Application shell: sticky header, flexible main, and footer.
 * Used by route-group layouts to keep chrome consistent.
 */
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-slate-900">
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
