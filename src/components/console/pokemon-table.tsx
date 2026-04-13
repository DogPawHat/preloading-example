import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { TypeBadge } from "./type-badge";
import { cn } from "~/lib/utils";

interface Pokemon {
  id: number;
  name: string;
  types: Array<{ name: string }>;
}

interface PokemonTableProps {
  pokemon: Pokemon[];
  className?: string;
}

/**
 * Pokemon data table with console styling.
 *
 * Displays Pokemon ID, name, and types in a monospace-styled table.
 * Used consistently across all example routes.
 *
 * @example
 * <PokemonTable pokemon={data.pokemon} />
 */
export function PokemonTable({ pokemon, className }: PokemonTableProps) {
  return (
    <Table className={cn("w-full border-collapse", "text-sm", "font-mono", className)}>
      <TableHeader>
        <TableRow className="border-b border-[var(--border-strong)]">
          <TableHead
            className={cn(
              "text-left py-3 px-3",
              "font-semibold text-[var(--text-secondary)]",
              "uppercase text-xs tracking-wider",
            )}
          >
            #
          </TableHead>
          <TableHead
            className={cn(
              "text-left py-3 px-3",
              "font-semibold text-[var(--text-secondary)]",
              "uppercase text-xs tracking-wider",
            )}
          >
            Name
          </TableHead>
          <TableHead
            className={cn(
              "text-left py-3 px-3",
              "font-semibold text-[var(--text-secondary)]",
              "uppercase text-xs tracking-wider",
            )}
          >
            Details
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pokemon.map((p) => (
          <TableRow
            key={p.name}
            className={cn(
              "border-b border-[var(--border-default)]",
              "transition-colors duration-fast ease-default",
              "hover:bg-[var(--bg-secondary)]",
            )}
          >
            <TableCell className="py-3 px-3 font-mono text-[var(--text-muted)]">{p.id}</TableCell>
            <TableCell className="py-3 px-3 capitalize text-[var(--text-primary)]">
              {p.name}
            </TableCell>
            <TableCell className="py-3 px-3">
              {p.types.map((type) => (
                <TypeBadge key={type.name} type={type.name} />
              ))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
