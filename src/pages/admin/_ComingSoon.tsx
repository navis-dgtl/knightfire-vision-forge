// Placeholder used by admin section routes whose implementation is in progress.
// Each section file replaces this with a real page as the build proceeds.
export default function ComingSoon({ section }: { section: string }) {
  return (
    <div className="rounded-lg border border-dashed p-10 text-center">
      <h2 className="text-lg font-heading font-semibold mb-1">{section}</h2>
      <p className="text-sm text-muted-foreground">Coming soon.</p>
    </div>
  );
}
