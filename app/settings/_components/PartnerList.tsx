"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import type { PartnerWithMeta } from "@/app/_types/partner";
import { deletePartner } from "@/app/settings/actions";
import { PrimaryButton } from "@/app/_components/PrimaryButton";
import { PartnerFormModal } from "./PartnerFormModal";

type BankAccount = { id: string; code: string; name: string };

type Props = {
  partners: PartnerWithMeta[];
  bankAccounts: BankAccount[];
};

type ModalState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; partner: PartnerWithMeta };

export const PartnerList = ({ partners, bankAccounts }: Props) => {
  const [modalState, setModalState] = useState<ModalState>({ mode: "closed" });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (partner: PartnerWithMeta) => {
    if (!confirm(`「${partner.name}」を削除しますか？`)) return;

    setDeletingId(partner.id);
    const result = await deletePartner(partner.id);
    setDeletingId(null);

    if ("error" in result) {
      toast.error(result.error);
    } else {
      toast.success("取引先を削除しました");
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">取引先一覧</h3>
        <PrimaryButton type="button" onClick={() => setModalState({ mode: "create" })}>
          追加
        </PrimaryButton>
      </div>

      {partners.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-500">
          取引先がありません。「追加」ボタンから作成してください。
        </p>
      ) : (
        <div className="overflow-hidden rounded border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-800">
              <tr>
                <th className="px-4 py-2 text-left font-medium">コード</th>
                <th className="px-4 py-2 text-left font-medium">取引先名</th>
                <th className="px-4 py-2 text-left font-medium">デフォルト入金口座</th>
                <th className="w-24 px-4 py-2 text-right font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {partners.map((partner) => (
                <tr key={partner.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                  <td className="px-4 py-2 font-mono text-xs text-zinc-600 dark:text-zinc-400">
                    {partner.code ?? "—"}
                  </td>
                  <td className="px-4 py-2">{partner.name}</td>
                  <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">
                    {partner.defaultReceiptAccountName ?? "—"}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setModalState({ mode: "edit", partner })}
                        className="rounded p-1 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                        title="編集"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(partner)}
                        disabled={deletingId === partner.id}
                        className="rounded p-1 text-red-500 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-900/20"
                        title="削除"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalState.mode === "create" && (
        <PartnerFormModal
          partnerId={null}
          defaultValues={{ name: "", code: "", defaultReceiptAccountId: "" }}
          isReferenced={false}
          bankAccounts={bankAccounts}
          onClose={() => setModalState({ mode: "closed" })}
        />
      )}
      {modalState.mode === "edit" && (
        <PartnerFormModal
          partnerId={modalState.partner.id}
          defaultValues={{
            name: modalState.partner.name,
            code: modalState.partner.code ?? "",
            defaultReceiptAccountId: modalState.partner.defaultReceiptAccountId ?? "",
          }}
          isReferenced={modalState.partner.isReferenced}
          bankAccounts={bankAccounts}
          onClose={() => setModalState({ mode: "closed" })}
        />
      )}
    </div>
  );
};
