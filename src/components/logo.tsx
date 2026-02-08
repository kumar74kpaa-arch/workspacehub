import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className="flex items-center justify-center" aria-label="9to5 logo">
      <span className={cn("font-bold text-lg font-headline", className)}>9to5</span>
    </div>
  );
}
