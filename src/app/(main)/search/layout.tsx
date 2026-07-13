import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Search hotels",
  description: "Find and compare premium hotel stays worldwide.",
};

export default function SearchLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return children;
}
