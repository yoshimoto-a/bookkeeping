import { NavLink } from "./NavLink";

export const SettingsNav = () => {
  return (
    <div className="mb-6 flex border-b border-zinc-200 dark:border-zinc-700">
      <NavLink href="/settings/accounts" label="勘定科目" />
      <NavLink href="/settings/tax" label="課税区分" />
      <NavLink href="/settings/presets" label="定型仕訳" />
      <NavLink href="/settings/partners" label="取引先" />
    </div>
  );
};
