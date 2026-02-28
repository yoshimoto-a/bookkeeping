"use client";

import Link from "next/link";
import { Settings, Book, FileText } from "lucide-react";
import { signOut } from "@/app/actions";

type Props = {
  email: string;
};

export const AuthedHeader = ({ email }: Props) => {
  return (
    <>
      <Link
        href="/journals"
        className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
        title="仕訳帳"
      >
        <FileText size={16} />
        仕訳帳
      </Link>
      <Link
        href="/ledger"
        className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
        title="総勘定元帳"
      >
        <Book size={16} />
        総勘定元帳
      </Link>
      <span className="text-sm text-gray-600">{email}</span>
      <Link
        href="/settings"
        className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
        title="設定"
      >
        <Settings size={16} />
      </Link>
      <form action={signOut}>
        <button
          type="submit"
          className="text-sm px-3 py-1 rounded border hover:bg-gray-100"
        >
          サインアウト
        </button>
      </form>
    </>
  );
};
