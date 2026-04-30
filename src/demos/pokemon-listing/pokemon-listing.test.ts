import { describe, expect, it } from "vite-plus/test";
import { POKEMON_LIMIT } from "~/demos/pokemon-listing/constants";
import { normalizePokemonNameFilter, toPokemonListing } from "./pokemon-listing";

const makeRows = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `pokemon-${index + 1}`,
    types: [{ name: "normal" }],
  }));

describe("pokemon listing", () => {
  it("shapes display rows and pagination from limit-plus-one results", () => {
    const listing = toPokemonListing(makeRows(POKEMON_LIMIT + 1), { offset: POKEMON_LIMIT });

    expect(listing.pokemon).toHaveLength(POKEMON_LIMIT);
    expect(listing.prevOffset).toBe(0);
    expect(listing.nextOffset).toBe(POKEMON_LIMIT * 2);
    expect(listing.pokemon[0]).toEqual({
      id: 1,
      name: "pokemon-1",
      types: [{ name: "normal" }],
    });
  });

  it("normalizes filtered listings without changing the caller's original filter value", () => {
    const listing = toPokemonListing(makeRows(1), {
      offset: 0,
      nameFilter: "  pika  ",
    });

    expect(normalizePokemonNameFilter("  pika  ")).toBe("pika");
    expect(listing.appliedFilter).toBe("pika");
    expect(listing.prevOffset).toBe(null);
    expect(listing.nextOffset).toBe(null);
  });
});
