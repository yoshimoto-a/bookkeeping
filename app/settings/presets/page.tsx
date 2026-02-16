import { getAuthenticatedUser } from "@/lib/auth";
import { getAccountsWithMeta, getPresetsWithMeta } from "../queries";
import { PresetList } from "../_components/PresetList";

const PresetsPage = async () => {
  const user = await getAuthenticatedUser();
  const [accounts, presets] = await Promise.all([
    getAccountsWithMeta(user.id),
    getPresetsWithMeta(user.id),
  ]);

  return <PresetList presets={presets} accounts={accounts} />;
};

export default PresetsPage;
