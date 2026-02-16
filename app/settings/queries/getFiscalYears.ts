import { prisma } from "@/lib/prisma";

export const getFiscalYears = async (userId: string): Promise<number[]> => {
  const currentYear = new Date().getFullYear();
  const existingSettings = await prisma.fiscalYearSetting.findMany({
    where: { userId },
    select: { fiscalYear: true },
    orderBy: { fiscalYear: "desc" },
  });

  const yearSet = new Set([
    currentYear,
    ...existingSettings.map((s) => s.fiscalYear),
  ]);
  return [...yearSet].sort((a, b) => b - a);
};
