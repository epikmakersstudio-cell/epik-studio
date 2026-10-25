import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const PageHeader = ({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) => (
  <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
    <div>
      <h1 className="font-serif text-3xl md:text-4xl">{title}</h1>
      {description && <p className="text-muted-foreground mt-1 max-w-2xl">{description}</p>}
    </div>
    {actions}
  </div>
);

export const LoadingBlock = ({ rows = 3, className }: { rows?: number; className?: string }) => (
  <div className="space-y-3" aria-label="Loading">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className={cn("h-20 rounded-lg bg-secondary animate-pulse", className)} />
    ))}
  </div>
);

export const ErrorBlock = ({ error, onRetry }: { error: unknown; onRetry: () => void }) => (
  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-5 text-sm" role="alert">
    <p className="mb-3">{error instanceof Error ? error.message : "Something went wrong."}</p>
    <button type="button" onClick={onRetry} className="text-primary font-medium hover:underline">
      Try again
    </button>
  </div>
);

export const EmptyBlock = ({ children }: { children: ReactNode }) => (
  <div className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">{children}</div>
);

export const Pager = ({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (page: number) => void }) =>
  totalPages > 1 ? (
    <nav className="flex items-center justify-center gap-3 mt-6 text-sm" aria-label="Pages">
      <button type="button" className="chip-luxury" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Previous
      </button>
      <span className="text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      <button type="button" className="chip-luxury" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        Next
      </button>
    </nav>
  ) : null;

export const Badge = ({ tone = "muted", children }: { tone?: "amber" | "green" | "sky" | "muted" | "primary"; children: ReactNode }) => (
  <span
    className={cn(
      "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
      tone === "amber" && "bg-amber-100 text-amber-900",
      tone === "green" && "bg-emerald-100 text-emerald-900",
      tone === "sky" && "bg-sky-100 text-sky-900",
      tone === "primary" && "bg-primary/10 text-primary",
      tone === "muted" && "bg-muted text-muted-foreground",
    )}
  >
    {children}
  </span>
);
