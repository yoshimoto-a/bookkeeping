const LedgerLoading = () => {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="mb-6 text-xl font-bold">総勘定元帳</h1>
      
      {/* フィルター部分のスケルトン */}
      <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <div className="h-6 w-24 animate-pulse bg-zinc-200 dark:bg-zinc-700"></div>
          <div className="h-8 w-20 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"></div>
        </div>
      </div>

      {/* 科目テーブルのスケルトン */}
      <div className="space-y-4">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 animate-pulse bg-zinc-200 dark:bg-zinc-700"></div>
                <div>
                  <div className="mb-1 h-5 w-40 animate-pulse bg-zinc-200 dark:bg-zinc-700"></div>
                  <div className="h-4 w-16 animate-pulse bg-zinc-200 dark:bg-zinc-700"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="mb-1 h-4 w-16 animate-pulse bg-zinc-200 dark:bg-zinc-700"></div>
                <div className="h-5 w-24 animate-pulse bg-zinc-200 dark:bg-zinc-700"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LedgerLoading;
