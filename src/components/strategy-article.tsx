interface StrategyArticleProps {
  eyebrow: string;
  title: string;
}

const loremIpsum =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

export function StrategyArticle({ eyebrow, title }: StrategyArticleProps) {
  return (
    <article className="border border-(--border-default) bg-(--bg-secondary) p-6 md:p-8 xl:sticky xl:top-20">
      <p className="mb-5 font-mono text-xs uppercase text-(--accent-default)">{eyebrow}</p>
      <h2 className="mb-6 text-3xl font-semibold uppercase leading-tight text-(--text-primary) md:text-4xl">
        {title}
      </h2>
      <div className="space-y-5 text-sm leading-7 text-(--text-secondary)">
        <p>{loremIpsum}</p>
        <p>{loremIpsum}</p>
      </div>
      <div className="mt-8 border-t border-(--border-default) pt-5 font-mono text-xs uppercase text-(--text-muted)">
        Strategy notes / walkthrough
      </div>
    </article>
  );
}
