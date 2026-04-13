import { cn } from "~/lib/utils";
import type { ReactNode } from "react";

interface CodeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  active?: boolean;
}

/**
 * Button styled for the console aesthetic.
 *
 * Uses monospace font, hairline border, and amber accent on hover/active.
 * Designed for pagination controls and technical actions.
 *
 * @example
 * <CodeButton onClick={prevPage}>
 *   <span>&lt;</span>
 *   <span>prev</span>
 * </CodeButton>
 *
 * <CodeButton active>Page 1</CodeButton>
 */
export function CodeButton({
  children,
  className,
  active = false,
  disabled,
  ...props
}: CodeButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-2",
        "px-3 py-2",
        "border border-[var(--border-default)]",
        "bg-[var(--bg-secondary)]",
        "font-mono text-sm",
        "text-[var(--text-primary)]",
        "transition-all duration-fast ease-default",
        "hover:border-[var(--accent-default)] hover:bg-[var(--accent-subtle)]",
        active && [
          "bg-[var(--accent-default)]",
          "border-[var(--accent-default)]",
          "text-[var(--text-inverse)]",
          "font-medium",
        ],
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
