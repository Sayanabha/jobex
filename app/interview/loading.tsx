import { SiteHeader } from "@/components/site-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function InterviewLoading() {
  return (
    <main className="min-h-screen pb-20">
      <SiteHeader />
      <section className="container space-y-6 py-12">
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Skeleton className="h-[560px] w-full rounded-[32px]" />
          <Skeleton className="h-[560px] w-full rounded-[32px]" />
        </div>
      </section>
    </main>
  );
}
