"use client";

import type { AccountWithMeta } from "@/app/_types/settings";
import { AccountList } from "./AccountList";

type Props = {
  accounts: AccountWithMeta[];
};

export const SettingsTabs = ({ accounts }: Props) => {
  return (
    <div>
      <AccountList accounts={accounts} />
    </div>
  );
};
