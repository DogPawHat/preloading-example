import { cn } from "~/design-system/utils/cn";
import { renderMarkdown } from "~/articles/__render-markdown.server";

interface ArticleShell {
  markdown: string;
}

export async function ArticleShell({ markdown }: ArticleShell) {
  const content = await renderMarkdown(markdown);

  const mainClassName = cn([
    "prose prose-sm max-w-none leading-7",
    "prose-headings:font-semibold prose-headings:text-(--text-primary)",
    "prose-h2:mb-6 prose-h2:mt-8 prose-h2:text-3xl prose-h2:first:mt-0 prose-h2:font-(--font-display)",
    "prose-h3:mb-3 prose-h3:mt-6 prose-h3:text-lg prose-h3:first:mt-0",
    "prose-p:mb-5 prose-p:text-(--text-secondary)",
    "prose-ul:mb-5 prose-ul:list-disc prose-ul:space-y-2 prose-ul:pl-5",
    "prose-ol:mb-5 prose-ol:list-decimal prose-ol:space-y-2 prose-ol:pl-5",
    "prose-li:text-(--text-secondary)",
    "prose-strong:font-semibold prose-strong:text-(--text-primary)",
    "prose-code:rounded prose-code:bg-(--bg-primary) prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-xs",
    "prose-pre:mb-5 prose-pre:overflow-x-auto prose-pre:rounded prose-pre:bg-(--bg-primary) prose-pre:p-4 prose-pre:font-mono prose-pre:text-xs",
    "prose-a:text-(--accent-default) prose-a:underline prose-a:decoration-(--accent-default)/30 prose-a:underline-offset-2 prose-a:hover:decoration-(--accent-default)",
    "prose-blockquote:mb-5 prose-blockquote:border-l-2 prose-blockquote:border-(--accent-default) prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-(--text-muted)",
    "prose-hr:my-8 prose-hr:border-(--border-default)",
  ]);

  return (
    <article className="border border-(--border-default) bg-(--bg-secondary) p-6 md:p-8 xl:sticky xl:top-20">
      <div className={mainClassName}>{content}</div>
    </article>
  );
}
