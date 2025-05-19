import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	HeadContent,
	Outlet,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import Header from "~/components/Header";

import type { QueryClient } from "@tanstack/react-query";
import appCss from "~/styles/global.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

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
				title: "fizzbuzz",
			},
		],
		links: [
			{ rel: "icon", href: "/favicon.ico" },
			{ rel: "stylesheet", href: appCss },
		],
	}),
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
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<Header />
				{props.children}
				<TanStackRouterDevtools />
				<ReactQueryDevtools buttonPosition="bottom-right" />
			</body>
		</html>
	);
}
