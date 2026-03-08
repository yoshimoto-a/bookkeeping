import { getAuthenticatedUser } from "@/lib/auth";
import { parseMonth } from "@/lib/date";
import { getJournalEntries } from "./queries/getJournalEntries";
import { getAccountsWithMeta } from "@/app/settings/queries/getAccountsWithMeta";
import { JournalList } from "./_components/JournalList";

type Props = {
  searchParams: Promise<{ month?: string }>;
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
