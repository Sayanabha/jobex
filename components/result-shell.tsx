import { Sparkles } from "lucide-react";

import { LoadingScene } from "@/components/loading-scene";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ResultShell({
  title,
  description,
  loading,
  loadingSteps,
  children,
}: {
  title: string;
  description: string;
  loading?: boolean;
  loadingSteps?: string[];
  children: React.ReactNode;
}) {
  return (
    <Card className="h-full border-white/10">
      <CardHeader>
        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Sparkles className="h-5 w-5" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoadingScene
            title={`Brewing ${title.toLowerCase()}`}
            subtitle="The AI is thinking in structured JSON instead of inspirational chaos. A small but meaningful win."
            steps={loadingSteps ?? [
              "Comparing your profile against the target role",
              "Turning recommendations into actual structure",
              "Polishing the answer so it lands like advice, not debris",
            ]}
          />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
