import { prisma } from "@/lib/prisma";

export const getBankAccounts = async (userId: string) =>
  prisma.account.findMany({
    where: {
      userId,
      OR: [
        { code: "BANK", parentId: null },
        { parent: { code: "BANK", userId } },
      ],
    },
    orderBy: { code: "asc" },
    select: { id: true, code: true, name: true },
  });
