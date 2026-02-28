"use client";

import type { LedgerAccount } from "../queries/getLedgerData";

type Props = {
  ledgerData: LedgerAccount[];
};

export const LedgerTable = ({ ledgerData }: Props) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ja-JP").format(amount);
  };

  if (ledgerData.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-zinc-500">
        表示する科目を選択してください。
      </div>
    );
  }

  const account = ledgerData[0]; // 選択された科目は1つのみ

  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      {/* 科目ヘッダー */}
      <div className="border-b border-zinc-200 p-4 dark:border-zinc-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-lg">
              {account.code} {account.name}
            </h3>
          </div>
          <div className="text-right">
            <div className="text-sm text-zinc-500">期末残高</div>
            <div className={`font-medium text-lg ${
              account.closingBalance >= 0 
                ? "text-zinc-900 dark:text-zinc-100" 
                : "text-red-600 dark:text-red-400"
            }`}>
              ¥{formatCurrency(Math.abs(account.closingBalance))}
              {account.closingBalance < 0 && " (貸)"}
            </div>
          </div>
        </div>
      </div>

      {/* 期首残高表示 */}
      {account.openingBalance !== 0 && (
        <div className="border-b border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/50">
          <div className="flex justify-between text-sm">
            <span className="font-medium">期首残高</span>
            <span className={`font-medium ${
              account.openingBalance >= 0 
                ? "text-zinc-900 dark:text-zinc-100" 
                : "text-red-600 dark:text-red-400"
            }`}>
              ¥{formatCurrency(Math.abs(account.openingBalance))}
              {account.openingBalance < 0 && " (貸)"}
            </span>
          </div>
        </div>
      )}

      {/* 明細テーブル */}
      {account.entries.length === 0 ? (
        <div className="p-8 text-center text-sm text-zinc-500">
          期間内の取引はありません
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-800">
              <tr>
                <th className="px-4 py-3 text-left font-medium">日付</th>
                <th className="px-4 py-3 text-left font-medium">摘要</th>
                <th className="px-4 py-3 text-left font-medium">取引先</th>
                <th className="px-4 py-3 text-right font-medium">借方</th>
                <th className="px-4 py-3 text-right font-medium">貸方</th>
                <th className="px-4 py-3 text-right font-medium">残高</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {account.entries.map((entry) => (
                <tr
                  key={entry.id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                >
                  <td className="px-4 py-3 font-medium">
                    {new Date(entry.entryDate).toLocaleDateString("ja-JP")}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {entry.description || "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {entry.partnerName || "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {entry.debit > 0 ? `¥${formatCurrency(entry.debit)}` : ""}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {entry.credit > 0 ? `¥${formatCurrency(entry.credit)}` : ""}
                  </td>
                  <td className={`px-4 py-3 text-right font-medium ${
                    entry.balance >= 0 
                      ? "text-zinc-900 dark:text-zinc-100" 
                      : "text-red-600 dark:text-red-400"
                  }`}>
                    ¥{formatCurrency(Math.abs(entry.balance))}
                    {entry.balance < 0 && " (貸)"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
