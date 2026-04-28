interface StrategyArticleProps {
  eyebrow: string;
  title: string;
}

const loremIpsum =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

export function StrategyArticle({ eyebrow, title }: StrategyArticleProps) {
  return (
    <article className="sticky top-6 rounded-[2rem] border border-(--border-default) bg-(--bg-secondary) p-6 shadow-[8px_8px_0_var(--border-default)] md:p-8">
      <p className="mb-5 font-mono text-xs uppercase tracking-[0.3em] text-(--accent-default)">
        {eyebrow}
      </p>
      <h2 className="mb-6 text-4xl font-black uppercase leading-none tracking-tight text-(--text-primary) md:text-5xl">
        {title}
      </h2>
      <div className="space-y-5 font-serif text-lg leading-8 text-(--text-secondary)">
        <p>{loremIpsum}</p>
        <p>{loremIpsum}</p>
      </div>
      <div className="mt-8 border-t border-(--border-default) pt-5 font-mono text-xs uppercase tracking-widest text-(--text-muted)">
        Strategy notes / walkthrough
      </div>
    </article>
  );
}
