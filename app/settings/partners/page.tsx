import { getAuthenticatedUser } from "@/lib/auth";
import { getPartnersWithMeta, getBankAccounts } from "../queries";
import { PartnerList } from "../_components/PartnerList";

const PartnersPage = async () => {
  const user = await getAuthenticatedUser();
  const [partners, bankAccounts] = await Promise.all([
    getPartnersWithMeta(user.id),
    getBankAccounts(user.id),
  ]);

  return <PartnerList partners={partners} bankAccounts={bankAccounts} />;
};

export default PartnersPage;
