import { cn } from "~/design-system/utils/cn";
import type { ReactNode } from "react";

interface DemoCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

/**
 * Primary content container with hairline border.
 *
 * The demo aesthetic uses zero border-radius and visible borders
 * to create a technical, information-dense feel.
 *
 * @example
 * <DemoCard>
 *   <h2>Content</h2>
 * </DemoCard>
 */
export function DemoCard({ children, className, hover = false }: DemoCardProps) {
  return (
    <div
      className={cn(
        "bg-(--bg-card)",
        "border border-(--border-default)",
        "p-6",
        hover && ["transition-colors duration-fast ease-default", "hover:border-(--border-strong)"],
        className,
      )}
    >
      {children}
    </div>
  );
}
