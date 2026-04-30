import { createFileRoute } from "@tanstack/react-router";
import { LandingPage, getLandingPage } from "~/landing/landing-page";

export const Route = createFileRoute("/")({
  loader: async () => {
    const landingPage = await getLandingPage();
    return { landingPage };
  },
  component: LandingPageComponent,
});

function LandingPageComponent() {
  const { landingPage } = Route.useLoaderData();
  return <LandingPage landingPage={landingPage} />;
}
