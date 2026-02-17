import { getAuthenticatedUser } from "@/lib/auth";
import { getJournalEntries } from "./queries/getJournalEntries";
import { getAccountsWithMeta } from "@/app/settings/queries/getAccountsWithMeta";
import { JournalList } from "./_components/JournalList";

type Props = {
  searchParams: Promise<{ year?: string; month?: string }>;
};

const JournalsPage = async ({ searchParams }: Props) => {
  const user = await getAuthenticatedUser();
  const params = await searchParams;
  const now = new Date();
  const year = params.year ? Number(params.year) : now.getFullYear();
  const month = params.month ? Number(params.month) : now.getMonth() + 1;
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
