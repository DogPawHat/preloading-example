function BlogTableSplitColumn({ blog, table }: { blog: React.ReactNode; table: React.ReactNode }) {
  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(34rem,1.1fr)] xl:items-start">
      {blog}
      <div className="min-w-0">{table}</div>
    </div>
  );
}

export { BlogTableSplitColumn };
