import { cn } from "~/design-system/utils/cn";

interface TypeBadgeProps {
  type: string;
  className?: string;
}

/**
 * Badge for displaying Pokemon types.
 *
 * Simple bordered label that fits the console aesthetic.
 * Multiple badges can be displayed inline for dual-type Pokemon.
 *
 * @example
 * <TypeBadge type="fire" />
 * <TypeBadge type="flying" />
 */
export function TypeBadge({ type, className }: TypeBadgeProps) {
  return (
    <span
      className={cn(
        "inline-block",
        "px-2 py-0.5",
        "text-xs font-mono",
        "border border-(--border-default)",
        "bg-(--bg-secondary)",
        "text-(--text-secondary)",
        "capitalize",
        "mr-1",
        className,
      )}
    >
      {type}
    </span>
  );
}
