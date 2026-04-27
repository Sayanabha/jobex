"use client";

import { useEffect, useState } from "react";
import { Orbit, Sparkles, Stars } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const iconMap = [Sparkles, Orbit, Stars];

export function LoadingScene({
  title,
  subtitle,
  steps,
  className,
}: {
  title: string;
  subtitle: string;
  steps: string[];
  className?: string;
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [activeIcon, setActiveIcon] = useState(0);

  useEffect(() => {
    const stepTimer = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % steps.length);
    }, 1600);

    const iconTimer = window.setInterval(() => {
      setActiveIcon((current) => (current + 1) % iconMap.length);
    }, 2200);

    return () => {
      window.clearInterval(stepTimer);
      window.clearInterval(iconTimer);
    };
  }, [steps.length]);

  const Icon = iconMap[activeIcon];

  return (
    <div className={cn("relative overflow-hidden rounded-[28px] border border-border bg-muted p-6", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,255,194,0.08),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(255,149,77,0.08),transparent_30%)]" />
      <div className="relative space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Badge className="mb-3 bg-primary/10 text-primary">Buffering with taste</Badge>
            <h3 className="font-display text-2xl text-foreground">{title}</h3>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-glow">
            <Icon className="h-6 w-6 animate-pulse" />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step}
              className={cn(
                "rounded-2xl border border-border px-4 py-3 text-sm text-muted-foreground transition-all duration-300",
                index === activeStep && "border-primary/40 bg-primary/10 text-foreground",
              )}
            >
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}