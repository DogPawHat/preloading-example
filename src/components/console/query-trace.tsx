import type { ReactNode } from "react";
import { StatusDotWithLabel } from "./status-dot";

type QueryTraceIndicator = "cached" | "fetching" | "idle" | "error";

interface QueryTraceStatus {
  indicator: QueryTraceIndicator;
  label: string;
}

interface QueryTraceProps {
  behaviorDescription: ReactNode;
  cacheStatus: QueryTraceStatus;
  fetchStatus: QueryTraceStatus;
  preloadStatus?: QueryTraceStatus;
  queryKeys: ReactNode[];
  strategyDescription: ReactNode;
}

export function QueryTrace({
  behaviorDescription,
  cacheStatus,
  fetchStatus,
  preloadStatus,
  queryKeys,
  strategyDescription,
}: QueryTraceProps) {
  return (
    <section
      className="mb-5 border border-(--border-default) bg-(--bg-secondary) p-4 font-mono"
      aria-label="Query behavior"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-(--text-secondary)">
            Behavior
          </p>
          <p className="mt-1 text-sm leading-relaxed text-(--text-primary)">
            {behaviorDescription}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs">
          <StatusDotWithLabel status={cacheStatus.indicator} label={cacheStatus.label} />
          {preloadStatus && (
            <StatusDotWithLabel status={preloadStatus.indicator} label={preloadStatus.label} />
          )}
          <StatusDotWithLabel status={fetchStatus.indicator} label={fetchStatus.label} />
        </div>
      </div>

      <dl className="mt-4 grid gap-3 border-t border-(--border-default) pt-3 text-xs sm:grid-cols-4">
        <div>
          <dt className="mb-1 uppercase tracking-wider text-(--text-muted)">Strategy</dt>
          <dd className="text-(--text-primary)">{strategyDescription}</dd>
        </div>
        <div>
          <dt className="mb-1 uppercase tracking-wider text-(--text-muted)">Query keys</dt>
          <dd className="space-y-1 text-(--text-primary)">
            {queryKeys.map((queryKey, index) => (
              <div key={index}>{queryKey}</div>
            ))}
          </dd>
        </div>
        <div>
          <dt className="mb-1 uppercase tracking-wider text-(--text-muted)">Fetch status</dt>
          <dd className="text-(--text-primary)">{fetchStatus.label}</dd>
        </div>
        {preloadStatus && (
          <div>
            <dt className="mb-1 uppercase tracking-wider text-(--text-muted)">Preload status</dt>
            <dd className="text-(--text-primary)">{preloadStatus.label}</dd>
          </div>
        )}
      </dl>
    </section>
  );
}
