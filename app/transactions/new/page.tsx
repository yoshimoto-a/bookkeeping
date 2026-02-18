import { getAuthenticatedUser } from "@/lib/auth";
import { getPresetsForForm } from "../queries/getPresetsForForm";
import { getAccountsWithMeta } from "@/app/settings/queries/getAccountsWithMeta";
import { getPartnersWithMeta } from "@/app/settings/queries/getPartnersWithMeta";
import { TransactionForm } from "../_components/TransactionForm";

const TransactionsNewPage = async () => {
  const user = await getAuthenticatedUser();
  const [presets, accounts, partners] = await Promise.all([
    getPresetsForForm(user.id),
    getAccountsWithMeta(user.id),
    getPartnersWithMeta(user.id),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="mb-6 text-xl font-bold">テンプレから登録</h1>
      <TransactionForm
        presets={presets}
        accounts={accounts}
        partners={partners}
      />
    </div>
  );
};

export default TransactionsNewPage;
