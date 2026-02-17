import { getAuthenticatedUser } from "@/lib/auth";
import { getAccountsWithMeta } from "@/app/settings/queries/getAccountsWithMeta";
import { JournalEntryForm } from "@/app/_components/JournalEntryForm";

const TransferNewPage = async () => {
  const user = await getAuthenticatedUser();
  const accounts = await getAccountsWithMeta(user.id);

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="mb-6 text-xl font-bold">振替伝票の登録</h1>
      <JournalEntryForm accounts={accounts} />
    </div>
  );
};

export default TransferNewPage;
