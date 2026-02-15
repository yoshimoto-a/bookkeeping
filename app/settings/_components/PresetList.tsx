"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import type { PresetWithAccounts } from "@/app/_types/preset";
import type { AccountWithMeta } from "@/app/_types/settings";
import { deletePreset } from "@/app/settings/actions";
import { PRESET_KIND_LABELS } from "@/lib/constants/presetKinds";
import { PrimaryButton } from "@/app/_components/PrimaryButton";
import { PresetFormModal } from "./PresetFormModal";

type Props = {
  presets: PresetWithAccounts[];
  accounts: AccountWithMeta[];
};

type ModalState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; preset: PresetWithAccounts };

export const PresetList = ({ presets, accounts }: Props) => {
  const [modalState, setModalState] = useState<ModalState>({ mode: "closed" });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (preset: PresetWithAccounts) => {
    if (!confirm(`「${preset.name}」を削除しますか？`)) return;

    setDeletingId(preset.id);
    const result = await deletePreset(preset.id);
    setDeletingId(null);

    if ("error" in result) {
      toast.error(result.error);
    } else {
      toast.success("定型仕訳を削除しました");
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">定型仕訳一覧</h3>
        <PrimaryButton type="button" onClick={() => setModalState({ mode: "create" })}>
          追加
        </PrimaryButton>
      </div>

      {presets.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-500">
          定型仕訳がありません。「追加」ボタンから作成してください。
        </p>
      ) : (
        <div className="overflow-hidden rounded border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-800">
              <tr>
                <th className="px-4 py-2 text-left font-medium">名前</th>
                <th className="px-4 py-2 text-left font-medium">種別</th>
                <th className="px-4 py-2 text-left font-medium">借方科目</th>
                <th className="px-4 py-2 text-left font-medium">貸方科目</th>
                <th className="w-24 px-4 py-2 text-right font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {presets.map((preset) => (
                <tr key={preset.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                  <td className="px-4 py-2">{preset.name}</td>
                  <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">
                    {PRESET_KIND_LABELS[preset.kind]}
                  </td>
                  <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">
                    {preset.fixedDebitAccount?.name ?? "—"}
                  </td>
                  <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">
                    {preset.fixedCreditAccount?.name ?? "—"}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setModalState({ mode: "edit", preset })}
                        className="rounded p-1 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                        title="編集"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(preset)}
                        disabled={deletingId === preset.id}
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
        <PresetFormModal
          preset={null}
          accounts={accounts}
          onClose={() => setModalState({ mode: "closed" })}
        />
      )}
      {modalState.mode === "edit" && (
        <PresetFormModal
          preset={modalState.preset}
          accounts={accounts}
          onClose={() => setModalState({ mode: "closed" })}
        />
      )}
    </div>
  );
};
