import { ChapterPager } from "~/components/chapter-navigation";
import { SectionHeader } from "~/components/console/section-header";

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

interface StrategyChapterLayoutProps {
  children: React.ReactNode;
  headerSubtitle?: string;
  headerTitle: string;
  sidebar?: React.ReactNode;
}

export function StrategyChapterLayout(props: StrategyChapterLayoutProps) {
  const { children, headerSubtitle, headerTitle, sidebar } = props;

  return (
    <main className="min-h-screen bg-(--bg-primary) p-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title={headerTitle} subtitle={headerSubtitle} />

        <StrategyPageLayout sidebar={sidebar}>{children}</StrategyPageLayout>
      </div>
    </main>
  );
}
