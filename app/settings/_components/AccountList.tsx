"use client";

import { Fragment, useState } from "react";
import toast from "react-hot-toast";
import type { AccountWithMeta } from "@/app/_types/settings";
import { deleteAccount } from "@/app/settings/actions";
import { ACCOUNT_TYPE_LABELS, ACCOUNT_TYPE_ORDER } from "@/lib/constants/accountTypes";
import { PrimaryButton } from "@/app/_components/PrimaryButton";
import { AccountFormModal } from "./AccountFormModal";
import { AccountParentRow } from "./account-list/AccountParentRow";
import { AccountChildRow } from "./account-list/AccountChildRow";

type Props = {
  accounts: AccountWithMeta[];
};

type ModalState =
  | { mode: "closed" }
  | { mode: "create"; parentId: string | null }
  | { mode: "edit"; account: AccountWithMeta };

/** 子科目を AccountWithMeta 形式に変換する */
const toAccountWithMeta = (
  child: { id: string; code: string; name: string },
  parent: AccountWithMeta,
): AccountWithMeta => ({
  ...child,
  type: parent.type,
  parentId: parent.id,
  isOwnerAccount: false,
  isReferenced: false,
  children: [],
});

export const AccountList = ({ accounts }: Props) => {
  const [modalState, setModalState] = useState<ModalState>({ mode: "closed" });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [collapsedParents, setCollapsedParents] = useState<Record<string, boolean>>({});

  const grouped = ACCOUNT_TYPE_ORDER.map((type) => ({
    type,
    label: ACCOUNT_TYPE_LABELS[type],
    items: accounts.filter((a) => a.type === type),
  })).filter((g) => g.items.length > 0);

  const handleDelete = async (target: { id: string; name: string }) => {
    if (!confirm(`「${target.name}」を削除しますか？`)) return;

    setDeletingId(target.id);
    const result = await deleteAccount(target.id);
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
        <PrimaryButton type="button" onClick={() => setModalState({ mode: "create", parentId: null })}>
          追加
        </PrimaryButton>
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
                      <AccountParentRow
                        account={account}
                        isCollapsed={!!collapsedParents[account.id]}
                        isDeleting={deletingId === account.id}
                        onToggle={() => toggleParent(account.id)}
                        onAddChild={() => setModalState({ mode: "create", parentId: account.id })}
                        onEdit={() => setModalState({ mode: "edit", account })}
                        onDelete={() => handleDelete(account)}
                      />
                      {!collapsedParents[account.id] &&
                        account.children.map((child) => (
                          <AccountChildRow
                            key={child.id}
                            child={child}
                            isDeleting={deletingId === child.id}
                            onEdit={() =>
                              setModalState({
                                mode: "edit",
                                account: toAccountWithMeta(child, account),
                              })
                            }
                            onDelete={() => handleDelete(child)}
                          />
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
