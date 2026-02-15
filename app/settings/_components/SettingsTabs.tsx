"use client";

import { useState } from "react";
import type { AccountWithMeta, FiscalYearSettingData } from "@/app/_types/settings";
import { AccountList } from "./AccountList";
import { TaxStatusForm } from "./TaxStatusForm";

type Props = {
  accounts: AccountWithMeta[];
  setting: FiscalYearSettingData;
  fiscalYear: number;
};

type Tab = "accounts" | "taxStatus";

const TABS: { key: Tab; label: string }[] = [
  { key: "accounts", label: "勘定科目" },
  { key: "taxStatus", label: "課税区分" },
];

export const SettingsTabs = ({ accounts, setting, fiscalYear }: Props) => {
  const [activeTab, setActiveTab] = useState<Tab>("accounts");

  return (
    <div>
      <div className="mb-6 flex border-b border-zinc-200 dark:border-zinc-700">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === key
                ? "border-b-2 border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
                : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === "accounts" && <AccountList accounts={accounts} />}
      {activeTab === "taxStatus" && <TaxStatusForm fiscalYear={fiscalYear} setting={setting} />}
    </div>
  );
};
