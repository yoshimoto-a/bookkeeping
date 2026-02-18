"use client";

import { useWatch, useFormContext } from "react-hook-form";
import type { JournalEntryFormValues } from "@/app/_types/journal";

const sumLines = (lines: { amount: number }[]) =>
  lines.reduce((acc, l) => acc + l.amount, 0);

export const JournalBalanceSummary = () => {
  const { control } = useFormContext<JournalEntryFormValues>();

  const debitLines = useWatch({ control, name: "debitLines" }) ?? [];
  const creditLines = useWatch({ control, name: "creditLines" }) ?? [];
  const debitTotal = sumLines(debitLines);
  const creditTotal = sumLines(creditLines);
  const isBalanced = debitTotal === creditTotal && debitTotal > 0;

  return (
    <div className="flex gap-4 rounded bg-zinc-50 px-4 py-2 text-sm dark:bg-zinc-800">
      <span>
        借方合計:{" "}
        <span className="font-semibold tabular-nums">
          {debitTotal.toLocaleString("ja-JP")}
        </span>
      </span>
      <span>
        貸方合計:{" "}
        <span className="font-semibold tabular-nums">
          {creditTotal.toLocaleString("ja-JP")}
        </span>
      </span>
      {debitTotal > 0 && !isBalanced && (
        <span className="text-red-500">※ 貸借が一致しません</span>
      )}
    </div>
  );
};
