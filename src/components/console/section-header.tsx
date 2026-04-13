import { cn } from "~/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

/**
 * Section header with monospace styling.
 *
 * Used at the top of route pages to display:
 * - The example number/title (e.g., "02_preloading")
 * - An optional subtitle explaining the pattern
 *
 * @example
 * <SectionHeader
 *   title="02_preloading"
 *   subtitle="// Route-level prefetch"
 * />
 */
export function SectionHeader({ title, subtitle, className }: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3",
        "py-3",
        "border-b border-(--border-default)",
        "mb-4",
        className,
      )}
    >
      <span
        className={cn(
          "text-base font-semibold",
          "uppercase tracking-wider",
          "text-(--text-secondary)",
          "font-mono",
        )}
      >
        {title}
      </span>
      {subtitle && <span className="text-sm text-(--text-muted) font-mono">{subtitle}</span>}
    </div>
  );
}
