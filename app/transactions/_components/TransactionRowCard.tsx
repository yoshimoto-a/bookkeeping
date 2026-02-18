"use client";

import type { PresetForForm } from "@/app/_types/transaction";
import type { AccountWithMeta } from "@/app/_types/settings";
import type { PartnerWithMeta } from "@/app/_types/partner";
import {
  TransactionRowHeader,
  TransactionBasicFields,
  TransactionConditionalFields,
} from "./transaction-row";

type Props = {
  index: number;
  selectedPreset: PresetForForm | null;
  accounts: AccountWithMeta[];
  partners: PartnerWithMeta[];
  removable: boolean;
  onRemove: () => void;
};

export const TransactionRowCard = ({
  index,
  selectedPreset,
  accounts,
  partners,
  removable,
  onRemove,
}: Props) => {
  return (
    <div className="relative rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      <TransactionRowHeader
        index={index}
        removable={removable}
        onRemove={onRemove}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <TransactionBasicFields index={index} />

        {selectedPreset && (
          <TransactionConditionalFields
            index={index}
            selectedPreset={selectedPreset}
            accounts={accounts}
            partners={partners}
          />
        )}
      </div>
    </div>
  );
};
