import { createFileRoute, Outlet, useMatches } from "@tanstack/react-router";

import { ChapterPager } from "~/components/chapter-navigation";
import { SectionHeader } from "~/components/console/section-header";

export const Route = createFileRoute("/_chapters")({
  staticData: {
    routeTitle: "FILL_THIS_IN",
    routeSubtitle: "FILL_THIS_IN",
  },
  component: RouteComponent,
});

function RouteComponent() {
  const matches = useMatches();
  const leaf = matches[matches.length - 1];
  const routeTitle = leaf.staticData.routeTitle;
  const routeSubtitle = leaf.staticData.routeSubtitle;

  if (!routeTitle || routeTitle === "FILL_THIS_IN") {
    throw new Error(`Route "${leaf?.routeId}" must define staticData.routeTitle`);
  }

  if (!routeSubtitle || routeSubtitle === "FILL_THIS_IN") {
    throw new Error(`Route "${leaf?.routeId}" must define staticData.routeSubtitle`);
  }

  return (
    <main className="min-h-screen bg-(--bg-primary) p-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title={routeTitle} subtitle={routeSubtitle} />

        <Outlet />
        <ChapterPager />
      </div>
    </main>
  );
}
