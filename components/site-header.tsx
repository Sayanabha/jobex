import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-18 items-center justify-between py-4">
        <Link href="/" className="font-display text-2xl font-bold tracking-tight text-white">
          jobex
        </Link>
        <div className="hidden items-center gap-3 md:flex">
          <Badge>Career chaos, but make it strategic.</Badge>
          <Button asChild variant="ghost">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/interview">Interview</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
