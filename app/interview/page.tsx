import { InterviewClient } from "@/components/interview-client";
import { SiteHeader } from "@/components/site-header";

export default function InterviewPage() {
  return (
    <main className="min-h-screen pb-20">
      <SiteHeader />
      <section className="container py-12">
        <InterviewClient />
      </section>
    </main>
  );
}
