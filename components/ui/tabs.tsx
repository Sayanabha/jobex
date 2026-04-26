"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive.Root;

export const TabsList = ({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) => (
  <TabsPrimitive.List
    className={cn("inline-flex rounded-full border border-white/10 bg-white/5 p-1", className)}
    {...props}
  />
);

export const TabsTrigger = ({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) => (
  <TabsPrimitive.Trigger
    className={cn(
      "rounded-full px-4 py-2 text-sm text-muted-foreground transition data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
      className,
    )}
    {...props}
  />
);

export const TabsContent = ({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) => (
  <TabsPrimitive.Content className={cn("mt-6", className)} {...props} />
);
