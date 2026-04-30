import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/design-system/ui/table";
import { TypeBadge } from "./type-badge";
import { cn } from "~/design-system/utils/cn";

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
            Types
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pokemon.map((p) => (
          <TableRow
            key={p.name}
            className={cn(
              "border-b border-(--border-default)",
              "transition-colors duration-fast ease-default",
              "hover:bg-(--bg-secondary)",
            )}
          >
            <TableCell className="py-3 px-3 font-mono text-(--text-muted)">{p.id}</TableCell>
            <TableCell className="py-3 px-3 capitalize text-(--text-primary)">{p.name}</TableCell>
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
