"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { Pencil } from "lucide-react";
import dayjs from "dayjs";
import type { JournalRow } from "@/app/_types/transaction";
import type { AccountWithMeta } from "@/app/_types/settings";
import type { JournalEntryFormValues } from "@/app/_types/journal";
import { JournalEntryForm } from "@/app/_components/JournalEntryForm";

type Props = {
  journals: JournalRow[];
  accounts: AccountWithMeta[];
  year: number;
  month: number;
};

const formatDate = (date: Date): string =>
  `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;

const formatAmount = (amount: number): string =>
  amount.toLocaleString("ja-JP");

export const JournalList = ({ journals, accounts, year, month }: Props) => {
  const router = useRouter();
  const [editTarget, setEditTarget] = useState<JournalRow | null>(null);

  const handlePrevMonth = () => {
    const d = new Date(year, month - 2, 1);
    router.push(`/journals?year=${d.getFullYear()}&month=${d.getMonth() + 1}`);
  };

  const handleNextMonth = () => {
    const d = new Date(year, month, 1);
    router.push(`/journals?year=${d.getFullYear()}&month=${d.getMonth() + 1}`);
  };

  const buildDefaultValues = (j: JournalRow): JournalEntryFormValues => ({
    entryDate: dayjs(j.txDate).format("YYYY-MM-DD"),
    debitAccountId: j.debitAccountId,
    creditAccountId: j.creditAccountId,
    amount: j.debitAmount,
    description: j.description ?? "",
  });

  const handleEditSuccess = () => {
    setEditTarget(null);
    router.refresh();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-center gap-4">
        <button
          onClick={handlePrevMonth}
          className="rounded px-3 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          ← 前月
        </button>
        <span className="text-lg font-semibold">
          {year}年{month}月
        </span>
        <button
          onClick={handleNextMonth}
          className="rounded px-3 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          次月 →
        </button>
      </div>

      {journals.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-500">
          仕訳データがありません
        </p>
      ) : (
        <div className="overflow-hidden rounded border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-800">
              <tr>
                <th className="px-4 py-2 text-left font-medium">日付</th>
                <th className="px-4 py-2 text-left font-medium">借方科目</th>
                <th className="px-4 py-2 text-right font-medium">借方金額</th>
                <th className="px-4 py-2 text-left font-medium">貸方科目</th>
                <th className="px-4 py-2 text-right font-medium">貸方金額</th>
                <th className="px-4 py-2 text-left font-medium">摘要</th>
                <th className="w-10 px-2 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {journals.map((j) => (
                <tr
                  key={j.id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                >
                  <td className="px-4 py-2">{formatDate(j.txDate)}</td>
                  <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">
                    {j.debitAccountName}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    {formatAmount(j.debitAmount)}
                  </td>
                  <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">
                    {j.creditAccountName}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    {formatAmount(j.creditAmount)}
                  </td>
                  <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">
                    {j.description ?? "—"}
                  </td>
                  <td className="px-2 py-2">
                    <button
                      type="button"
                      onClick={() => setEditTarget(j)}
                      className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                      title="編集"
                    >
                      <Pencil size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>仕訳の編集</DialogTitle>
        <DialogContent>
          {editTarget && (
            <div className="pt-2">
              <JournalEntryForm
                accounts={accounts}
                journalEntryId={editTarget.id}
                defaultValues={buildDefaultValues(editTarget)}
                onSuccess={handleEditSuccess}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
