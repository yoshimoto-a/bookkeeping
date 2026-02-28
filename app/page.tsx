import Link from "next/link";
import { getAuthenticatedUser } from "@/lib/auth";

const MENU_ITEMS = [
  { href: "/transactions/new", title: "テンプレから登録", description: "定型仕訳テンプレートを使って仕訳を登録します" },
  { href: "/transfers/new", title: "振替伝票", description: "振替仕訳を登録します" },
  { href: "/journals", title: "仕訳帳", description: "登録済みの仕訳を一覧で確認します" },
  { href: "/ledger", title: "総勘定元帳", description: "勘定科目ごとの取引履歴と残高を確認します" },
] as const;

const cardClass =
  "flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-6 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800";

const HomePage = async () => {
  await getAuthenticatedUser();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-8 text-2xl font-bold">メニュー</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {MENU_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className={cardClass}>
            <span className="text-lg font-semibold">{item.title}</span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {item.description}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
