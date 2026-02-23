import { getAuthenticatedUser } from "@/lib/auth";
import { getLedgerData } from "./queries/getLedgerData";
import { getAccountsWithMeta } from "@/app/settings/queries/getAccountsWithMeta";
import { LedgerView } from "./_components/LedgerView";

type SearchParams = {
  accountId?: string;
  startDate?: string;
  endDate?: string;
};

type LedgerPageProps = {
  searchParams: Promise<SearchParams>;
};

const LedgerPage = async ({ searchParams }: LedgerPageProps) => {
  const user = await getAuthenticatedUser();
  const resolvedSearchParams = await searchParams;
  const { accountId, startDate, endDate } = resolvedSearchParams;

  const [ledgerData, accounts] = await Promise.all([
    getLedgerData(user.id, accountId, startDate, endDate),
    getAccountsWithMeta(user.id),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="mb-6 text-xl font-bold">総勘定元帳</h1>
      
      <LedgerView
        ledgerData={ledgerData}
        accounts={accounts}
        currentFilters={{
          accountId: accountId || null,
          startDate: startDate || null,
          endDate: endDate || null,
        }}
      />
    </div>
  );
};

export default LedgerPage;
