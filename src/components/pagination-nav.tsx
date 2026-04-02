import { type FileRoutesByPath, Link } from "@tanstack/react-router";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";

export function PaginationNav(props: {
  prefetch?: "intent" | false;
  prevOffset: number | undefined;
  nextOffset: number | undefined;
  to: keyof FileRoutesByPath;
}) {
  return (
    <nav className="flex justify-center gap-4 mt-6">
      <Button
        variant="outline"
        className={cn(
          "border-3 border-[#0a0a0a] text-xs font-bold uppercase tracking-[0.2em] px-6 py-2 hover:bg-[#0a0a0a] hover:text-white transition-colors",
          props.prevOffset == null && "opacity-30 cursor-not-allowed",
        )}
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        asChild
      >
        <Link
          preload={props.prefetch}
          to={props.to}
          search={{ offset: props.prevOffset }}
          disabled={props.prevOffset == null}
        >
          PREV
        </Link>
      </Button>
      <Button
        variant="outline"
        className={cn(
          "border-3 border-[#0a0a0a] text-xs font-bold uppercase tracking-[0.2em] px-6 py-2 hover:bg-[#0a0a0a] hover:text-white transition-colors",
          props.nextOffset == null && "opacity-30 cursor-not-allowed",
        )}
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        asChild
      >
        <Link
          preload={props.prefetch}
          to={props.to}
          search={{ offset: props.nextOffset }}
          disabled={props.nextOffset == null}
        >
          NEXT
        </Link>
      </Button>
    </nav>
  );
}
