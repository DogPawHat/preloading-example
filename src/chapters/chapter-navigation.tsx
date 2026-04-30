"use client";

import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  chapters,
  getChapterByPath,
  getChapterNeighbors,
  type ChapterPath,
} from "~/chapters/chapters";
import { cn } from "~/design-system/utils/cn";

export function ChapterSelect() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const currentChapter = getChapterByPath(pathname);

  return (
    <label className="chapter-select">
      <span className="sr-only">Jump to chapter</span>
      <select
        value={currentChapter?.to ?? "/"}
        onChange={(event) => {
          const to = event.currentTarget.value;

          if (to === "/") {
            void navigate({ to: "/" });
            return;
          }

          void navigate({ to: to as ChapterPath });
        }}
        className="chapter-select__control"
        aria-label="Jump to chapter"
      >
        <option value="/">Contents</option>
        {chapters.map((chapter) => (
          <option key={chapter.to} value={chapter.to}>
            {chapter.navLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ChapterPager() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { current, previous, next } = getChapterNeighbors(pathname);

  if (!current) {
    return null;
  }

  return (
    <nav className="chapter-pager" aria-label="Chapter navigation">
      <ChapterPagerLink direction="previous" chapter={previous} />

      <Link
        to="/"
        className="chapter-pager__contents focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
      >
        Contents
      </Link>

      <ChapterPagerLink direction="next" chapter={next} />
    </nav>
  );
}

function ChapterPagerLink(props: {
  direction: "previous" | "next";
  chapter: (typeof chapters)[number] | undefined;
}) {
  const { direction, chapter } = props;
  const isPrevious = direction === "previous";

  if (!chapter) {
    return (
      <span
        className={cn(
          "chapter-pager__link chapter-pager__link--disabled",
          !isPrevious && "text-right",
        )}
      >
        <span className="chapter-pager__kicker">{isPrevious ? "Previous" : "Next"}</span>
        <span className="chapter-pager__title">End of sequence</span>
      </span>
    );
  }

  return (
    <Link
      to={chapter.to}
      preload="intent"
      className={cn(
        "chapter-pager__link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)",
        !isPrevious && "text-right",
      )}
    >
      <span className="chapter-pager__kicker">{isPrevious ? "Previous" : "Next"}</span>
      <span className="chapter-pager__title">
        {isPrevious ? "< " : ""}
        {chapter.number} / {chapter.title}
        {!isPrevious ? " >" : ""}
      </span>
    </Link>
  );
}
