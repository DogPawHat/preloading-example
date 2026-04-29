import { ChapterPager } from "~/components/chapter-navigation";

interface StrategyPageLayoutProps {
  sidebar?: React.ReactNode;
  children: React.ReactNode;
}

export function StrategyPageLayout({ sidebar, children }: StrategyPageLayoutProps) {
  return (
    <>
      <div className="grid gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(34rem,1.1fr)] xl:items-start">
        {sidebar}
        <div className="min-w-0">{children}</div>
      </div>
      <ChapterPager />
    </>
  );
}
