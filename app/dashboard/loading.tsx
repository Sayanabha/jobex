import { SiteHeader } from "@/components/site-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <main className="min-h-screen pb-20">
      <SiteHeader />
      <section className="container space-y-6 py-12">
        <Skeleton className="h-56 w-full rounded-[32px]" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 w-full rounded-[32px]" />
          <Skeleton className="h-80 w-full rounded-[32px]" />
        </div>
      </section>
    </main>
  );
}
