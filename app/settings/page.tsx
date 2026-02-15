import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { SettingsTabs } from "./_components/SettingsTabs";

const SettingsPage = async () => {
  const user = await getAuthenticatedUser();

  const [rawAccounts, referencedAccountIds] = await Promise.all([
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
    prisma.journalLine
      .findMany({
        where: { entry: { userId: user.id } },
        select: { accountId: true },
        distinct: ["accountId"],
      })
      .then((lines) => new Set(lines.map((l) => l.accountId))),
  ]);

  const accounts = rawAccounts.map((a) => ({
    ...a,
    isReferenced: referencedAccountIds.has(a.id),
  }));

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">設定</h1>
      </div>
      <SettingsTabs accounts={accounts} />
    </div>
  );
};

export default SettingsPage;
