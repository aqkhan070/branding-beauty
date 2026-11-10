import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Phone({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative aspect-[9/19] w-[260px] rounded-[2.6rem] bg-plum p-[9px] shadow-float", className)}>
      <div className="relative h-full w-full overflow-hidden rounded-[2.1rem] bg-cream">
        <div className="absolute left-1/2 top-2 z-20 h-5 w-20 -translate-x-1/2 rounded-full bg-plum" />
        <div className="type-label flex items-center justify-between px-6 pt-2.5 text-plum">
          <span>9:41</span>
          <span>●●●</span>
        </div>
        <div className="h-[calc(100%-28px)] overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

export function Browser({ children, className, url = "app.beautyhub.demo" }: { children: ReactNode; className?: string; url?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border bg-pure shadow-float", className)}>
      <div className="flex items-center gap-2 border-b border-border bg-muted px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-blush" />
        <span className="h-2.5 w-2.5 rounded-full bg-rose/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-mauve/50" />
        <div className="type-label ml-3 flex-1 truncate rounded-md bg-pure px-3 py-1 text-muted-foreground">{url}</div>
      </div>
      {children}
    </div>
  );
}

export function SectionHead({ eyebrow, title, sub, className }: { eyebrow: string; title: string; sub?: string; className?: string }) {
  return (
    <div className={cn("mx-auto max-w-3xl px-6 text-center", className)}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="type-section mt-5">{title}</h2>
      {sub && <p className="type-body mx-auto mt-6 max-w-xl text-muted-foreground">{sub}</p>}
    </div>
  );
}
