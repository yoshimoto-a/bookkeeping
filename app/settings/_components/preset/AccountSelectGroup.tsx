"use client";

import type { AccountWithMeta } from "@/app/_types/settings";
import { ACCOUNT_TYPE_LABELS, ACCOUNT_TYPE_ORDER } from "@/lib/constants/accountTypes";

type Props = {
  accounts: AccountWithMeta[];
};

export const AccountSelectGroup = ({ accounts }: Props) => {
  const groups = ACCOUNT_TYPE_ORDER.map((type) => ({
    type,
    label: ACCOUNT_TYPE_LABELS[type],
    items: accounts.filter((a) => a.type === type),
  })).filter((g) => g.items.length > 0);

  return groups.map(({ type, label, items }) => (
    <optgroup key={type} label={label}>
      {items.map((a) => (
        <option key={a.id} value={a.id}>
          {a.name}
        </option>
      ))}
    </optgroup>
  ));
};
