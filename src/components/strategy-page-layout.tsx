import { ChapterPager } from "~/components/chapter-navigation";
import { StrategyArticle } from "~/components/strategy-article";

interface StrategyPageLayoutProps {
  articleEyebrow: string;
  articleTitle: string;
  children: React.ReactNode;
}

export function StrategyPageLayout({
  articleEyebrow,
  articleTitle,
  children,
}: StrategyPageLayoutProps) {
  return (
    <>
      <div className="grid gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(34rem,1.1fr)] xl:items-start">
        <StrategyArticle eyebrow={articleEyebrow} title={articleTitle} />
        <div className="min-w-0">{children}</div>
      </div>
      <ChapterPager />
    </>
  );
}
