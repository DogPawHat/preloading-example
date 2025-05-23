import { type FileRoutesByPath, Link } from "@tanstack/react-router";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";

export function PaginationNav(props: {
	prevOffset: number | undefined;
	nextOffset: number | undefined;
	to: keyof FileRoutesByPath;
}) {
	return (
		<nav className="flex justify-center gap-4 mt-4">
			<Button
				variant="outline"
				className={cn(
					props.prevOffset == null && "opacity-50 cursor-not-allowed",
				)}
				asChild
			>
				<Link
					to={props.to}
					search={{ offset: props.prevOffset }}
					disabled={props.prevOffset == null}
				>
					Previous
				</Link>
			</Button>
			<Button
				variant="outline"
				className={cn(
					props.nextOffset == null && "opacity-50 cursor-not-allowed",
				)}
				asChild
			>
				<Link
					to={props.to}
					search={{ offset: props.nextOffset }}
					disabled={props.nextOffset == null}
				>
					Next
				</Link>
			</Button>
		</nav>
	);
}
