import { getAuthenticatedUser } from "@/lib/auth";
import { SettingsTabs } from "./_components/SettingsTabs";
import { SettingsHeader } from "./_components/SettingsHeader";
import { getAccountsWithMeta, getFiscalYearSetting, getFiscalYears } from "./queries";

type Props = {
  searchParams: Promise<{ fiscalYear?: string }>;
};

const SettingsPage = async ({ searchParams }: Props) => {
  const user = await getAuthenticatedUser();
  const params = await searchParams;
  const currentYear = new Date().getFullYear();
  const fiscalYear = params.fiscalYear ? Number(params.fiscalYear) : currentYear;

  const { id } = user
  const [accounts, setting, years] = await Promise.all([
    getAccountsWithMeta(id),
    getFiscalYearSetting(id, fiscalYear),
    getFiscalYears(id),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <SettingsHeader years={years} />
      <SettingsTabs
        accounts={accounts}
        setting={setting}
        fiscalYear={fiscalYear}
      />
    </div>
  );
};

export default SettingsPage;
