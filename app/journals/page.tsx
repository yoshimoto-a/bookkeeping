import { getAuthenticatedUser } from "@/lib/auth";
import { getJournalEntries } from "./queries/getJournalEntries";
import { getAccountsWithMeta } from "@/app/settings/queries/getAccountsWithMeta";
import { JournalList } from "./_components/JournalList";

type Props = {
  searchParams: Promise<{ month?: string }>;
};

const parseMonth = (param?: string): { year: number; month: number } => {
  const now = new Date();
  if (param && /^\d{6}$/.test(param)) {
    const year = Number(param.slice(0, 4));
    const month = Number(param.slice(4, 6));
    if (month >= 1 && month <= 12) return { year, month };
  }
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
};

const JournalsPage = async ({ searchParams }: Props) => {
  const user = await getAuthenticatedUser();
  const params = await searchParams;
  const { year, month } = parseMonth(params.month);
  const [journals, accounts] = await Promise.all([
    getJournalEntries(user.id, year, month),
    getAccountsWithMeta(user.id),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="mb-6 text-xl font-bold">仕訳帳</h1>
      <JournalList
        journals={journals}
        accounts={accounts}
        year={year}
        month={month}
      />
    </div>
  );
};

export default JournalsPage;
