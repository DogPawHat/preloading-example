import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { renderServerComponent } from "@tanstack/react-start/rsc";

import Header from "~/components/header";

import type { QueryClient } from "@tanstack/react-query";
import appCss from "~/styles/global.css?url";
import { createServerFn } from "@tanstack/react-start";

interface MyRouterContext {
  queryClient: QueryClient;
}

const getHead = createServerFn({ method: "GET" }).handler(async () => {
  return {
    head: await renderServerComponent(
      <head>
        <HeadContent />
      </head>,
    ),
  };
});

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Prefetching Patterns",
      },
    ],
    links: [
      { rel: "icon", href: "/favicon.ico" },
      { rel: "stylesheet", href: appCss },
      // JetBrains Mono from Google Fonts
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  loader: () => {
    return getHead();
  },
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument(props: Readonly<{ children: React.ReactNode }>) {
  const { head } = Route.useLoaderData();

  return (
    <html lang="en">
      {head}
      <body>
        <Header />
        {props.children}
        <TanStackRouterDevtools />
        <ReactQueryDevtools buttonPosition="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
