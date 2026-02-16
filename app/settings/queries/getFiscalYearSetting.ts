import { prisma } from "@/lib/prisma";
import type { FiscalYearSettingData } from "@/app/_types/settings";

export const getFiscalYearSetting = async (
  userId: string,
  fiscalYear: number
): Promise<FiscalYearSettingData> =>
  prisma.fiscalYearSetting.findUnique({
    where: { userId_fiscalYear: { userId, fiscalYear } },
  });
