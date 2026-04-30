import type { FallbackProps } from "react-error-boundary";
import { Button } from "~/design-system/ui/button";

export function DemoErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="min-h-125 flex flex-col items-center justify-center gap-4 border border-(--border-default) bg-(--bg-card) p-6">
      <div className="text-center space-y-2">
        <p className="text-sm font-mono font-semibold text-(--status-error)">
          Failed to load Pok&eacute;mon data
        </p>
        <p className="max-w-md text-xs font-mono text-(--text-muted) leading-relaxed">
          {getErrorMessage(error)}
        </p>
      </div>
      <Button onClick={resetErrorBoundary} size="sm" className="font-mono">
        Try again
      </Button>
    </div>
  );
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "An unknown error occurred";
}
