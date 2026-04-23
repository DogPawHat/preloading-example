import { cn } from "~/lib/utils";

interface StatusDotProps {
  status: "cached" | "fetching" | "idle" | "error";
  className?: string;
}

/**
 * Status indicator dot for showing cache/fetching state.
 *
 * Used in navigation and data tables to indicate:
 * - cached: Data is available in cache (green)
 * - fetching: Data is currently loading (amber, animated)
 * - idle: No active request (neutral)
 * - error: Request failed (red)
 */
export function StatusDot({ status, className }: StatusDotProps) {
  return (
    <span
      className={cn(
        "inline-block w-2 h-2 rounded-full shrink-0",
        status === "cached" && [
          "bg-(--status-cached)",
          "shadow-[0_0_0_2px_var(--status-cached-glow)]",
        ],
        status === "fetching" && ["bg-(--status-fetching)", "animate-pulse-dot"],
        status === "idle" && "bg-(--status-idle)",
        status === "error" && [
          "bg-(--status-error)",
          "shadow-[0_0_0_2px_var(--status-error-glow)]",
        ],
        className,
      )}
      aria-hidden="true"
    />
  );
}

/**
 * Status dot with label for accessibility
 */
export function StatusDotWithLabel({
  status,
  label,
  className,
}: StatusDotProps & { label: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <StatusDot status={status} />
      <span className="text-sm font-mono text-(--text-muted)">{label}</span>
    </span>
  );
}
