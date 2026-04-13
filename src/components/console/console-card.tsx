import { cn } from "~/lib/utils";
import type { ReactNode } from "react";

interface ConsoleCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

/**
 * Primary content container with hairline border.
 *
 * The console aesthetic uses zero border-radius and visible borders
 * to create a technical, information-dense feel.
 *
 * @example
 * <ConsoleCard>
 *   <h2>Content</h2>
 * </ConsoleCard>
 */
export function ConsoleCard({ children, className, hover = false }: ConsoleCardProps) {
  return (
    <div
      className={cn(
        "bg-[var(--bg-card)]",
        "border border-[var(--border-default)]",
        "p-6",
        hover && [
          "transition-colors duration-fast ease-default",
          "hover:border-[var(--border-strong)]",
        ],
        className,
      )}
    >
      {children}
    </div>
  );
}
