import { redirect } from "next/navigation";

/**
 * Assignment is a single-page app — search lives on `/`.
 */
export default function SearchPage() {
  redirect("/");
}
