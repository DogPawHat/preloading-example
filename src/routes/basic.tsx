import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { $pokeApiClient } from '../data/client'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '~/components/ui/table'

export const Route = createFileRoute('/basic')({
  component: RouteComponent,
})

interface PokemonListResult {
  name: string;
  url: string;
}

function RouteComponent() {
  // Use the generated hook from openapi-react-query
  // const { data, isLoading, error } = $pokeApiClient.pokemon_list.useQuery({
  //   query: { limit: 50, offset: 0 },
  // })

  const { data, isLoading, error } = useQuery($pokeApiClient.queryOptions('get', '/api/v2/pokemon/' ))

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading Pokémon.</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">National Pokédex: Pokémon 1-50</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.results?.map((pokemon: PokemonListResult, idx: number) => (
            <TableRow key={pokemon.name}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell className="capitalize">{pokemon.name}</TableCell>
              <TableCell>
                <a
                  href={pokemon.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
