import { getAuthenticatedUser } from "@/lib/auth";
import { getPresetsForForm } from "../queries/getPresetsForForm";
import { getAccountsWithMeta } from "@/app/settings/queries/getAccountsWithMeta";
import { getPartnersWithMeta } from "@/app/settings/queries/getPartnersWithMeta";
import { TransactionForm } from "../_components/TransactionForm";

const TransactionsNewPage = async () => {
  const user = await getAuthenticatedUser();
  const [presetsResult, accounts, partners] = await Promise.all([
    getPresetsForForm(user.id),
    getAccountsWithMeta(user.id),
    getPartnersWithMeta(user.id),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="mb-6 text-xl font-bold">テンプレから登録</h1>
      
      {!presetsResult.success ? (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {presetsResult.error}
        </div>
      ) : (
        <TransactionForm
          presets={presetsResult.data}
          accounts={accounts}
          partners={partners}
        />
      )}
    </div>
  );
};

export default TransactionsNewPage;
