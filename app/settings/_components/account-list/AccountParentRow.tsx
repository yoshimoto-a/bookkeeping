import { Pencil, Trash2, Plus, ChevronDown, ChevronRight } from "lucide-react";
import type { AccountWithMeta } from "@/app/_types/settings";
import { IconButton } from "./IconButton";

type Props = {
  account: AccountWithMeta;
  isCollapsed: boolean;
  isDeleting: boolean;
  onToggle: () => void;
  onAddChild: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export const AccountParentRow = ({
  account,
  isCollapsed,
  isDeleting,
  onToggle,
  onAddChild,
  onEdit,
  onDelete,
}: Props) => (
  <tr className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
    <td className="px-4 py-2 font-mono text-xs">{account.code}</td>
    <td className="px-4 py-2">
      <div className="flex items-center gap-2">
        <button
          onClick={onToggle}
          className="rounded p-1 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
          aria-label={isCollapsed ? "展開" : "折りたたみ"}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
        </button>
        <span>{account.name}</span>
      </div>
    </td>
    <td className="px-4 py-2 text-right">
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={onAddChild}
          className="flex items-center gap-1 rounded px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          title="補助科目を追加"
        >
          <Plus size={12} /> 補助科目
        </button>
        <IconButton icon={Pencil} label="編集" onClick={onEdit} />
        {account.isOwnerAccount ? (
          <button className="invisible rounded p-1" aria-hidden>
            <Trash2 size={14} />
          </button>
        ) : (
          <IconButton
            icon={Trash2}
            label="削除"
            variant="danger"
            disabled={isDeleting}
            onClick={onDelete}
          />
        )}
      </div>
    </td>
  </tr>
);
