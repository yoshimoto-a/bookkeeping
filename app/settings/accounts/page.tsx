import { getAuthenticatedUser } from "@/lib/auth";
import { getAccountsWithMeta } from "../queries";
import { AccountList } from "../_components/AccountList";

const AccountsPage = async () => {
  const user = await getAuthenticatedUser();
  const accounts = await getAccountsWithMeta(user.id);

  return <AccountList accounts={accounts} />;
};

export default AccountsPage;
