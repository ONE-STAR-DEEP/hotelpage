import { Container, Spinner } from "@/components/ui";

export default function Loading() {
  return (
    <Container className="flex min-h-[50vh] items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" label="Loading page" />
        <p className="text-sm text-slate-500">Loading…</p>
      </div>
    </Container>
  );
}
