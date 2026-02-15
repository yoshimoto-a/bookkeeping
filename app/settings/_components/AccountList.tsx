"use client";

import { Fragment, useState } from "react";
import { Pencil, Trash2, Plus, ChevronDown, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import type { AccountType } from "@prisma/client";
import type { AccountWithMeta } from "@/app/_types/settings";
import { deleteAccount } from "@/app/settings/actions";
import { AccountFormModal } from "./AccountFormModal";

type Props = {
  accounts: AccountWithMeta[];
};

const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  ASSET: "資産",
  LIABILITY: "負債",
  EQUITY: "純資産",
  REVENUE: "収益",
  EXPENSE: "費用",
};

const ACCOUNT_TYPE_ORDER: AccountType[] = [
  "ASSET",
  "LIABILITY",
  "EQUITY",
  "REVENUE",
  "EXPENSE",
];

type ModalState =
  | { mode: "closed" }
  | { mode: "create"; parentId: string | null }
  | { mode: "edit"; account: AccountWithMeta };

export const AccountList = ({ accounts }: Props) => {
  const [modalState, setModalState] = useState<ModalState>({ mode: "closed" });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  // 子科目の折りたたみ状態
  const [collapsedParents, setCollapsedParents] = useState<Record<string, boolean>>({});

  const grouped = ACCOUNT_TYPE_ORDER.map((type) => ({
    type,
    label: ACCOUNT_TYPE_LABELS[type],
    items: accounts.filter((a) => a.type === type),
  })).filter((g) => g.items.length > 0);

  const handleDelete = async (account: AccountWithMeta | { id: string; name: string }) => {
    if (!confirm(`「${account.name}」を削除しますか？`)) return;

    setDeletingId(account.id);
    const result = await deleteAccount(account.id);
    setDeletingId(null);

    if ("error" in result) {
      toast.error(result.error);
    } else {
      toast.success("勘定科目を削除しました");
    }
  };

  const toggleParent = (id: string) => {
    setCollapsedParents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">勘定科目一覧</h3>
        <button
          onClick={() => setModalState({ mode: "create", parentId: null })}
          className="rounded bg-zinc-900 px-3 py-1.5 text-sm text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          追加
        </button>
      </div>

      <div className="space-y-6">
        {grouped.map(({ type, label, items }) => (
          <div key={type}>
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
              {label}
            </h4>
            <div className="overflow-hidden rounded border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
              <table className="w-full text-sm">
                <thead className="bg-zinc-50 dark:bg-zinc-800">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">コード</th>
                    <th className="px-4 py-2 text-left font-medium">科目名</th>
                    <th className="w-36 px-4 py-2 text-right font-medium">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {items.map((account) => (
                    <Fragment key={account.id}>
                      <tr className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                        <td className="px-4 py-2 font-mono text-xs">{account.code}</td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleParent(account.id)}
                              className="rounded p-1 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
                              aria-label={collapsedParents[account.id] ? "展開" : "折りたたみ"}
                            >
                              {collapsedParents[account.id] ? (
                                <ChevronRight size={14} />
                              ) : (
                                <ChevronDown size={14} />
                              )}
                            </button>
                            <span>{account.name}</span>
                            {account.children.length > 0 && (
                              <span className="ml-1 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 group-hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300">
                                補助 {account.children.length}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setModalState({ mode: "create", parentId: account.id })}
                              className="flex items-center gap-1 rounded px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                              title="補助科目を追加"
                            >
                              <Plus size={12} /> 補助科目
                            </button>
                            <button
                              onClick={() => setModalState({ mode: "edit", account })}
                              className="rounded p-1 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                              title="編集"
                            >
                              <Pencil size={14} />
                            </button>
                            {account.isOwnerAccount ? (
                              // 削除不可でもレイアウトを揃えるため不可視ボタンでスペース確保
                              <button className="invisible rounded p-1" aria-hidden>
                                <Trash2 size={14} />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleDelete(account)}
                                disabled={deletingId === account.id}
                                className="rounded p-1 text-red-500 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-900/20"
                                title="削除"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      {!collapsedParents[account.id] && account.children.map((child) => (
                        <tr key={child.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                          <td className="py-2 pl-10 pr-4 font-mono text-xs text-zinc-500 relative">
                            <span className="absolute left-6 top-0 h-full w-px bg-zinc-200 dark:bg-zinc-700" />
                            {child.code}
                          </td>
                          <td className="py-2 pl-10 pr-4 text-zinc-600 dark:text-zinc-400">
                            <span className="mr-1 text-xs text-zinc-400">└</span>
                            {child.name}
                          </td>
                          <td className="px-4 py-2 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* 親行と同じ3ボタン幅を維持するため、補助追加は不可視プレースホルダー */}
                              <button className="invisible flex items-center gap-1 rounded px-2 py-1 text-xs" aria-hidden>
                                <Plus size={12} /> 補助科目
                              </button>
                              {/* 子科目の編集 */}
                              <button
                                onClick={() => setModalState({
                                  mode: "edit",
                                  account: {
                                    id: child.id,
                                    code: child.code,
                                    name: child.name,
                                    type: account.type,
                                    parentId: account.id,
                                    isOwnerAccount: false,
                                    isReferenced: false,
                                    children: [],
                                  },
                                })}
                                className="rounded p-1 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                title="編集"
                              >
                                <Pencil size={14} />
                              </button>
                              {/* 子科目の削除 */}
                              <button
                                onClick={() => handleDelete(child)}
                                disabled={deletingId === child.id}
                                className="rounded p-1 text-red-500 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-900/20"
                                title="削除"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {modalState.mode === "create" && (
        <AccountFormModal
          account={null}
          parentId={modalState.parentId}
          accounts={accounts}
          onClose={() => setModalState({ mode: "closed" })}
        />
      )}
      {modalState.mode === "edit" && (
        <AccountFormModal
          account={modalState.account}
          parentId={null}
          accounts={accounts}
          onClose={() => setModalState({ mode: "closed" })}
        />
      )}
    </div>
  );
};
