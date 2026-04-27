import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

import { AuthPanel } from "@/components/auth-panel";
import { FeatureCard } from "@/components/feature-card";
import { HeroOrb } from "@/components/hero-orb";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { dashboardCards } from "@/lib/constants";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="container grid gap-16 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div className="animate-fade-up">
          <Badge className="mb-6 bg-primary/10 text-primary">AI-powered career path simulator</Badge>
          <h1 className="max-w-3xl font-display text-5xl font-semibold tracking-tight text-foreground md:text-7xl">
            Career planning, simplified.
          </h1>
          <p className="mt-6 max-w-2xl text-balance text-xl text-muted-foreground">
            jobex maps your skill gaps, builds your roadmap, suggests portfolio projects, runs mock interviews, and simulates bold career pivots without the usual fluffy nonsense.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/dashboard">
                Open dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/interview">Try interview mode</Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Yes, you can leave your job. Relax.
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Interview coming up? We've got you.
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Resume feeling… mid? Fix it here.
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Not sure what's next? Start here.
            </div>
          </div>
        </div>
        <div className="relative animate-fade-up">
          <HeroOrb />
          <div className="absolute inset-x-6 bottom-6 rounded-[32px] border border-white/10 bg-background/80 p-6 shadow-glow backdrop-blur-xl">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-4 w-4" />
              <p className="text-sm font-medium">Today's reality check</p>
            </div>
            <p className="mt-3 font-display text-2xl text-foreground">
              "You don't need a reboot... just a tighter story and receipts"
            </p>
          </div>
        </div>
      </section>

      <section className="container pb-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-primary">Inside the MVP</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-foreground md:text-4xl">
              Five strategic engines. Zero generic chatbot energy.
            </h2>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {dashboardCards.map((card) => (
            <FeatureCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      <section className="container pb-24">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
          <div className="rounded-[32px] border border-border bg-card p-8">
            <p className="text-sm uppercase tracking-[0.25em] text-primary">Sign in</p>
            <h3 className="mt-3 font-display text-3xl font-semibold text-foreground">
              Save your profile, your simulations, and your dignity.
            </h3>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              Email magic link or password. Because friction is not a personality trait.
            </p>
          </div>
          <AuthPanel />
        </div>
      </section>
    </main>
  );
}