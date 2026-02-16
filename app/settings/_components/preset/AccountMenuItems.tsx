"use client";

import type { AccountWithMeta } from "@/app/_types/settings";
import { ACCOUNT_TYPE_LABELS, ACCOUNT_TYPE_ORDER } from "@/lib/constants/accountTypes";
import { AppMenuGroup } from "@/app/_components/AppMenuGroup";

type Props = {
  accounts: AccountWithMeta[];
};

export const AccountMenuItems = ({ accounts }: Props) => {
  const groups = ACCOUNT_TYPE_ORDER.map((type) => ({
    type,
    label: ACCOUNT_TYPE_LABELS[type],
    items: accounts.filter((a) => a.type === type).map((a) => ({ value: a.id, label: a.name })),
  })).filter((g) => g.items.length > 0);

  return (
    <>
      {groups.map(({ type, label, items }) => (
        <AppMenuGroup key={type} groupLabel={label} items={items} />
      ))}
    </>
  );
};
