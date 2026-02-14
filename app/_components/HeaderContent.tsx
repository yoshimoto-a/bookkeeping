"use client";

import { signOut } from "@/app/actions";

type Props = {
  email: string;
};

export const AuthedHeader = ({ email }: Props) => {
  return (
    <>
      <span className="text-sm text-gray-600">{email}</span>
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
