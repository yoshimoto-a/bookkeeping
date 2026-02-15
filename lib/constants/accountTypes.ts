import type { AccountType } from "@prisma/client";

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  ASSET: "資産",
  LIABILITY: "負債",
  EQUITY: "純資産",
  REVENUE: "収益",
  EXPENSE: "費用",
};

export const ACCOUNT_TYPE_ORDER: AccountType[] = [
  "ASSET",
  "LIABILITY",
  "EQUITY",
  "REVENUE",
  "EXPENSE",
];