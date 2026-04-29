import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";

interface PokemonTableSkeletonProps {
  /**
   * Number of skeleton rows to render (defaults to 10 for POKEMON_LIMIT)
   */
  rowCount?: number;
  className?: string;
}

/**
 * Skeleton loading state for the Pokemon table.
 *
 * Renders skeleton rows that exactly match the height of real table rows
 * to prevent layout shift when data loads. Uses the same padding and
 * structure as the actual PokemonTable component.
 *
 * @example
 * <PokemonTableSkeleton rowCount={10} />
 */
export function PokemonTableSkeleton({ rowCount = 10, className }: PokemonTableSkeletonProps) {
  return (
    <Table className={cn("w-full border-collapse", "text-sm", "font-mono", className)}>
      <TableHeader>
        <TableRow className="border-b border-(--border-strong)">
          <TableHead
            className={cn(
              "text-left py-3 px-3",
              "font-semibold text-(--text-secondary)",
              "uppercase text-xs tracking-wider",
            )}
          >
            #
          </TableHead>
          <TableHead
            className={cn(
              "text-left py-3 px-3",
              "font-semibold text-(--text-secondary)",
              "uppercase text-xs tracking-wider",
            )}
          >
            Name
          </TableHead>
          <TableHead
            className={cn(
              "text-left py-3 px-3",
              "font-semibold text-(--text-secondary)",
              "uppercase text-xs tracking-wider",
            )}
          >
            Details
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rowCount }).map((_, index) => (
          <SkeletonRow key={index} />
        ))}
      </TableBody>
    </Table>
  );
}

/**
 * Skeleton row that exactly matches the height of a real table row.
 *
 * Real rows have py-3 (12px) padding + content. This skeleton uses
 * identical padding to ensure zero layout shift when data loads.
 */
function SkeletonRow() {
  return (
    <TableRow className="border-b border-(--border-default)">
      <TableCell className="py-3 px-3">
        <div className="h-4 w-8 bg-(--bg-secondary) animate-pulse" />
      </TableCell>
      <TableCell className="py-3 px-3">
        <div className="h-4 w-32 bg-(--bg-secondary) animate-pulse" />
      </TableCell>
      <TableCell className="py-3 px-3">
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-(--bg-secondary) animate-pulse" />
          <div className="h-5 w-16 bg-(--bg-secondary) animate-pulse" />
        </div>
      </TableCell>
    </TableRow>
  );
}

interface PokemonTableContainerProps {
  /**
   * The actual PokemonTable component with data
   */
  children: React.ReactNode;
  /**
   * Number of rows expected (for skeleton sizing)
   */
  rowCount?: number;
  className?: string;
}

/**
 * Suspense-wrapped container for Pokemon tables.
 *
 * Provides a consistent loading state across all routes while
 * maintaining the console aesthetic. The table header is shown
 * immediately to set expectations for the data structure.
 *
 * @example
 * <PokemonTableContainer rowCount={10}>
 *   <PokemonTable pokemon={data.pokemon} />
 * </PokemonTableContainer>
 */
export function PokemonTableContainer({
  children,
  rowCount,
  className,
}: PokemonTableContainerProps) {
  return (
    <React.Suspense fallback={<PokemonTableSkeleton rowCount={rowCount} className={className} />}>
      {children}
    </React.Suspense>
  );
}
