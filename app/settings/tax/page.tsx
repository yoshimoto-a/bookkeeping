import { getAuthenticatedUser } from "@/lib/auth";
import { getFiscalYearSetting, getFiscalYears } from "../queries";
import { TaxStatusForm } from "../_components/TaxStatusForm";
import FiscalYearSelector from "../_components/FiscalYearSelector";

type Props = {
  searchParams: Promise<{ fiscalYear?: string }>;
};

const TaxPage = async ({ searchParams }: Props) => {
  const user = await getAuthenticatedUser();
  const params = await searchParams;
  const currentYear = new Date().getFullYear();
  const fiscalYear = params.fiscalYear ? Number(params.fiscalYear) : currentYear;

  const [setting, years] = await Promise.all([
    getFiscalYearSetting(user.id, fiscalYear),
    getFiscalYears(user.id),
  ]);

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <FiscalYearSelector years={years} fiscalYear={fiscalYear} />
      </div>
      <TaxStatusForm fiscalYear={fiscalYear} setting={setting} />
    </div>
  );
};

export default TaxPage;
