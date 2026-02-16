"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const NavLink = ({ href, label }: { href: string; label: string }) => {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={`px-4 py-2 text-sm font-medium transition-colors ${
        pathname === href
          ? "border-b-2 border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
          : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      }`}
    >
      {label}
    </Link>
  );
};
