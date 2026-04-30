import { Link } from "@tanstack/react-router";
import { StatusDot, StatusDotWithLabel } from "~/chapters/status-dot";
import { chapterGroups } from "~/chapters/chapters";

export function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col bg-(--bg-primary)">
      <section className="border-b border-(--border-default) bg-(--bg-secondary)">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[minmax(0,0.78fr)_minmax(20rem,0.42fr)] lg:items-end">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <StatusDot status="cached" />
              <span className="text-sm font-mono uppercase text-(--text-muted)">
                Interactive technical book
              </span>
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold text-(--text-primary) mb-5 leading-[1.05] sm:text-5xl">
              Prefetching Patterns
            </h1>
            <p className="text-base text-(--text-secondary) max-w-2xl leading-relaxed">
              A chaptered learning lab for comparing no preloading, route preloading, intent
              preloading, search-param driven data, and synced local collections.
            </p>
          </div>

          <aside className="toc-status" aria-label="Reading status legend">
            <StatusDot status="cached" />
            <span className="text-xs font-mono uppercase text-(--text-muted)">
              Read in order. Each chapter keeps the console beside the explanation.
            </span>
            <div className="mt-5 grid gap-3 text-sm font-mono text-(--text-muted)">
              <StatusDotWithLabel status="cached" label="Cached route data" />
              <StatusDotWithLabel status="fetching" label="Fetching in progress" />
              <StatusDotWithLabel status="idle" label="Idle route" />
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-12">
        <h2 className="mb-8 border-b border-(--border-default) pb-4 text-xl font-semibold text-(--text-primary)">
          Table of contents
        </h2>

        <div className="grid gap-10">
          {chapterGroups.map((group) => (
            <section key={group.label} className="toc-group" aria-labelledby={`toc-${group.label}`}>
              <div className="toc-group__heading">
                <h3 id={`toc-${group.label}`} className="toc-group__title">
                  {group.label}
                </h3>
                <p className="toc-group__description">{group.description}</p>
              </div>

              <ol className="toc-list">
                {group.chapters.map((chapter, chapterIndex) => (
                  <li key={chapter.to}>
                    <Link
                      to={chapter.to}
                      preload={chapterIndex === 0 ? false : "intent"}
                      className="toc-link group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
                    >
                      <span className="toc-link__number">{chapter.number}</span>
                      <span className="toc-link__body">
                        <span className="toc-link__title">{chapter.title}</span>
                        <span className="toc-link__summary">{chapter.summary}</span>
                        <span className="toc-link__tags" aria-label="Concepts">
                          {chapter.tags.map((tag) => (
                            <span key={tag} className="toc-link__tag">
                              {tag}
                            </span>
                          ))}
                        </span>
                      </span>
                      <span className="toc-link__open" aria-hidden="true">
                        &gt;
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>

        <div className="mt-12 border-t border-(--border-default) pt-6">
          <Link
            to="/basic"
            className="inline-flex items-center gap-2 border border-(--accent-default) bg-(--accent-surface) px-4 py-3 font-mono text-sm font-semibold text-(--text-primary) transition-colors duration-fast hover:bg-(--accent-subtle) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
          >
            Start reading
            <span aria-hidden="true">&gt;</span>
          </Link>
        </div>
      </section>

      <footer className="border-t border-(--border-default) bg-(--bg-card) mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-6 text-sm font-mono text-(--text-muted)">
          <p>
            Built with{" "}
            <a
              href="https://tanstack.com/router/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="text-(--accent-default) hover:text-(--accent-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-card) transition-colors duration-fast"
            >
              TanStack Router
            </a>
            {" · "}
            <a
              href="https://tanstack.com/query/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="text-(--accent-default) hover:text-(--accent-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-card) transition-colors duration-fast"
            >
              TanStack Query
            </a>
            {" · "}
            <a
              href="https://tanstack.com/start/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="text-(--accent-default) hover:text-(--accent-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-card) transition-colors duration-fast"
            >
              TanStack Start
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
