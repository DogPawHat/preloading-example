import { renderMarkdown } from "~/utils/markdown";

interface StrategyArticleProps {
  title: string;
  markdown: string;
}

export async function StrategyArticle({ title, markdown }: StrategyArticleProps) {
  const content = await renderMarkdown(markdown);

  return (
    <article className="border border-(--border-default) bg-(--bg-secondary) p-6 md:p-8 xl:sticky xl:top-20">
      <h2 className="mb-6 text-3xl font-semibold uppercase leading-tight text-(--text-primary) md:text-4xl">
        {title}
      </h2>
      <div
        className={[
          "space-y-5 text-sm leading-7 text-(--text-secondary)",
          "[&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-(--text-primary) [&_h2]:first:mt-0",
          "[&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-(--text-primary) first:[&_h3]:mt-0",
          "[&_p]:mb-5",
          "[&_ul]:mb-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5",
          "[&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5",
          "[&_li]:text-(--text-secondary)",
          "[&_strong]:font-semibold [&_strong]:text-(--text-primary)",
          "[&_code]:rounded [&_code]:bg-(--bg-primary) [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs",
          "[&_pre]:mb-5 [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:bg-(--bg-primary) [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-xs",
          "[&_a]:text-(--accent-default) [&_a]:underline [&_a]:decoration-(--accent-default)/30 [&_a]:underline-offset-2 hover:[&_a]:decoration-(--accent-default)",
          "[&_blockquote]:mb-5 [&_blockquote]:border-l-2 [&_blockquote]:border-(--accent-default) [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-(--text-muted)",
          "[&_hr]:my-8 [&_hr]:border-(--border-default)",
        ].join(" ")}
      >
        {content}
      </div>
      <div className="mt-8 border-t border-(--border-default) pt-5 font-mono text-xs uppercase text-(--text-muted)">
        Strategy notes / walkthrough
      </div>
    </article>
  );
}
