import { prisma } from "@/lib/prisma";
import type { PartnerWithMeta } from "@/app/_types/partner";

export const getPartnersWithMeta = async (userId: string): Promise<PartnerWithMeta[]> => {
  const [rawPartners, referencedPartnerIds] = await Promise.all([
    prisma.partner.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        code: true,
        defaultReceiptAccountId: true,
        defaultReceiptAccount: { select: { name: true } },
      },
    }),
    prisma.journalEntry
      .findMany({
        where: { userId, partnerId: { not: null } },
        select: { partnerId: true },
        distinct: ["partnerId"],
      })
      .then((rows) => new Set(rows.map((r) => r.partnerId))),
  ]);

  return rawPartners.map((p) => ({
    id: p.id,
    name: p.name,
    code: p.code,
    defaultReceiptAccountId: p.defaultReceiptAccountId,
    defaultReceiptAccountName: p.defaultReceiptAccount?.name ?? null,
    isReferenced: referencedPartnerIds.has(p.id),
  }));
};
