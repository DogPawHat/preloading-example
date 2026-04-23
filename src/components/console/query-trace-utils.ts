import type { QueryStatus } from "@tanstack/react-query";

type FetchStatus = "fetching" | "idle" | "paused";

export function getCacheStatus(dataUpdatedAt?: number) {
  return dataUpdatedAt
    ? { indicator: "cached" as const, label: "cache populated" }
    : { indicator: "idle" as const, label: "cache empty" };
}

export function getFetchStatus(fetchStatus?: FetchStatus, queryStatus?: QueryStatus) {
  if (queryStatus === "error") {
    return { indicator: "error" as const, label: "error" };
  }

  if (fetchStatus === "fetching") {
    return { indicator: "fetching" as const, label: "fetching" };
  }

  if (fetchStatus === "paused") {
    return { indicator: "idle" as const, label: "paused" };
  }

  return { indicator: "idle" as const, label: "request idle" };
}

export function getLoadingCacheStatus() {
  return { indicator: "idle" as const, label: "cache empty" };
}

export function getLoadingFetchStatus() {
  return { indicator: "fetching" as const, label: "fetching" };
}

export function getPreloadStatus(dataUpdatedAt?: number) {
  return dataUpdatedAt
    ? { indicator: "cached" as const, label: "preload complete" }
    : { indicator: "idle" as const, label: "not preloaded" };
}

export function getLoadingPreloadStatus() {
  return { indicator: "fetching" as const, label: "preloading" };
}

export function formatPokemonListQueryKey(location: string, offset: number) {
  return `pokemon-list / ${location} / offset ${offset}`;
}

export function formatFilteredPokemonListQueryKey(
  location: string,
  offset: number,
  nameFilter: string,
) {
  const filter = nameFilter ? `name "${nameFilter}"` : 'name ""';
  return `pokemon-list / ${location} / offset ${offset} / ${filter}`;
}
