import { SettingsNav } from "./_components/SettingsNav";

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold">設定</h1>
      <SettingsNav />
      {children}
    </div>
  );
};

export default SettingsLayout;
