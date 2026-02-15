import Link from "next/link";

export const SecondaryLink = (props: React.ComponentProps<typeof Link>) => (
  <Link
    {...props}
    className="flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium transition-colors border border-zinc-300 text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
  />
);
