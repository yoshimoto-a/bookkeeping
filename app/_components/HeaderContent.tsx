"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import { signOut } from "@/app/actions";

type Props = {
  email: string;
};

export const AuthedHeader = ({ email }: Props) => {
  return (
    <>
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
