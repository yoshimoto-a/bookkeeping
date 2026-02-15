import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { SettingsTabs } from "./_components/SettingsTabs";
import { SettingsHeader } from "./_components/SettingsHeader";

type Props = {
  searchParams: Promise<{ fiscalYear?: string }>;
};

const SettingsPage = async ({ searchParams }: Props) => {
  const user = await getAuthenticatedUser();
  const params = await searchParams;
  const currentYear = new Date().getFullYear();
  const fiscalYear = params.fiscalYear ? Number(params.fiscalYear) : currentYear;

  const [rawAccounts, setting, existingSettings, referencedAccountIds] = await Promise.all([
    prisma.account.findMany({
      where: { userId: user.id, parentId: null },
      orderBy: [{ type: "asc" }, { code: "asc" }],
      select: {
        id: true,
        code: true,
        name: true,
        type: true,
        isOwnerAccount: true,
        parentId: true,
        children: {
          select: { id: true, code: true, name: true },
          orderBy: { code: "asc" },
        },
      },
    }),
    prisma.fiscalYearSetting.findUnique({
      where: { userId_fiscalYear: { userId: user.id, fiscalYear } },
    }),
    prisma.fiscalYearSetting.findMany({
      where: { userId: user.id },
      select: { fiscalYear: true },
      orderBy: { fiscalYear: "desc" },
    }),
    prisma.journalLine
      .findMany({
        where: { entry: { userId: user.id } },
        select: { accountId: true },
        distinct: ["accountId"],
      })
      .then((lines: { accountId: string }[]) => new Set(lines.map((l) => l.accountId))),
  ]);

  const accounts = rawAccounts.map((a) => ({
    ...a,
    isReferenced: referencedAccountIds.has(a.id),
  }));

  const yearSet = new Set([
    currentYear,
    ...existingSettings.map((s) => s.fiscalYear),
  ]);
  const years = [...yearSet].sort((a, b) => b - a);

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <SettingsHeader years={years} />
      <SettingsTabs
        accounts={accounts}
        setting={setting}
        fiscalYear={fiscalYear}
      />
    </div>
  );
};

export default SettingsPage;
