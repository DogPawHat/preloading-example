export const chapterGroups = [
  {
    label: "Foundations",
    description: "Start with route loading, then add preloading before the reader clicks.",
    chapters: [
      {
        number: "01",
        to: "/basic",
        navLabel: "01 / Basic",
        title: "Basic",
        routeTitle: "01_basic",
        summary: "Baseline fetching. Data loads only after the route renders.",
        tags: ["suspense", "query"],
      },
      {
        number: "02",
        to: "/preloading",
        navLabel: "02 / Preloading",
        title: "Preloading",
        routeTitle: "02_preloading",
        summary: "Route loader prefetch. The next screen can render from warmed query data.",
        tags: ["loader", "prefetch"],
      },
      {
        number: "03",
        to: "/intent-preloading",
        navLabel: "03 / Intent preloading",
        title: "Intent preloading",
        routeTitle: "03_intent-preloading",
        summary: "Hover and focus intent preloads the route before activation.",
        tags: ["intent", "link"],
      },
    ],
  },
  {
    label: "Route State",
    description: "Make search params part of the lesson with pages, filters, and typing intent.",
    chapters: [
      {
        number: "04",
        to: "/pagination",
        navLabel: "04 / Pagination",
        title: "Pagination",
        routeTitle: "04_pagination",
        summary: "Adjacent pages preload so previous and next navigation stays warm.",
        tags: ["pagination", "viewport"],
      },
      {
        number: "05",
        to: "/filters",
        navLabel: "05 / Filters",
        title: "Filters",
        routeTitle: "05_filters",
        summary: "Submitted search params drive filtered data and prefetch behavior.",
        tags: ["search params", "filter"],
      },
      {
        number: "06",
        to: "/debounced-preload-filters",
        navLabel: "06 / Debounced filters",
        title: "Debounced filters",
        routeTitle: "06_debounced",
        summary: "Typing preloads likely filtered results before the form is submitted.",
        tags: ["debounce", "prefetch"],
      },
    ],
  },
  {
    label: "Local-First",
    description: "Move from fetching routes to subscribing to synced collections.",
    chapters: [
      {
        number: "07",
        to: "/live-query",
        navLabel: "07 / Live query",
        title: "Live query",
        routeTitle: "07_live-query",
        summary: "TanStack DB reads from an Electric SQL synced collection.",
        tags: ["electric", "live query"],
      },
      {
        number: "08",
        to: "/live-query-filters",
        navLabel: "08 / Live query filters",
        title: "Live query filters",
        routeTitle: "08_live-query-filters",
        summary: "Reactive filtered live queries update from local synced data.",
        tags: ["reactive", "sync"],
      },
    ],
  },
] as const;

export const chapters = [
  ...chapterGroups[0].chapters,
  ...chapterGroups[1].chapters,
  ...chapterGroups[2].chapters,
] as const;

export type Chapter = (typeof chapters)[number];
export type ChapterPath = Chapter["to"];

export function getChapterByPath(pathname: string) {
  return chapters.find((chapter) => chapter.to === pathname);
}

export function getChapterNeighbors(pathname: string) {
  const index = chapters.findIndex((chapter) => chapter.to === pathname);

  if (index === -1) {
    return { current: undefined, previous: undefined, next: undefined };
  }

  return {
    current: chapters[index],
    previous: chapters[index - 1],
    next: chapters[index + 1],
  };
}
