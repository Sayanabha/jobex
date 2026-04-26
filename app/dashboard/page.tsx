import { DashboardClient } from "@/components/dashboard-client";
import { SiteHeader } from "@/components/site-header";

export default function DashboardPage() {
  return (
    <main className="min-h-screen pb-20">
      <SiteHeader />
      <section className="container py-12">
        <DashboardClient />
      </section>
    </main>
  );
}
