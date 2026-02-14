import { AccountType } from "@prisma/client";

type AccountTemplate = {
  code: string;
  name: string;
  type: AccountType;
  isOwnerAccount: boolean;
};

export const ACCOUNT_TEMPLATES: AccountTemplate[] = [
  { code: "OWNER_WITHDRAWAL", name: "事業主貸", type: AccountType.ASSET, isOwnerAccount: true },
  { code: "OWNER_ADVANCE", name: "事業主借", type: AccountType.LIABILITY, isOwnerAccount: true },
  { code: "CAPITAL", name: "元入金", type: AccountType.EQUITY, isOwnerAccount: true },
  { code: "CASH", name: "現金", type: AccountType.ASSET, isOwnerAccount: false },
  { code: "BANK", name: "普通預金", type: AccountType.ASSET, isOwnerAccount: false },
  { code: "AR", name: "売掛金", type: AccountType.ASSET, isOwnerAccount: false },
  { code: "VAT_PREPAID", name: "仮払消費税", type: AccountType.ASSET, isOwnerAccount: false },
  { code: "TOOLS", name: "工具器具備品", type: AccountType.ASSET, isOwnerAccount: false },
  { code: "ACCUM_DEPR", name: "減価償却累計額", type: AccountType.ASSET, isOwnerAccount: false },
  { code: "BULK_ASSET", name: "一括償却資産", type: AccountType.ASSET, isOwnerAccount: false },
  { code: "VAT_PAYABLE", name: "仮受消費税", type: AccountType.LIABILITY, isOwnerAccount: false },
  { code: "SALES", name: "売上", type: AccountType.REVENUE, isOwnerAccount: false },
  { code: "MISC_REV", name: "雑収入", type: AccountType.REVENUE, isOwnerAccount: false },
  { code: "SALES_DISCOUNT", name: "売上値引", type: AccountType.REVENUE, isOwnerAccount: false },
  { code: "FEE", name: "支払手数料", type: AccountType.EXPENSE, isOwnerAccount: false },
  { code: "CONTRACT_COMM", name: "通信費", type: AccountType.EXPENSE, isOwnerAccount: false },
  { code: "DEPR_EXP", name: "減価償却費", type: AccountType.EXPENSE, isOwnerAccount: false },
  { code: "CONSUMABLES", name: "消耗品費", type: AccountType.EXPENSE, isOwnerAccount: false },
];
