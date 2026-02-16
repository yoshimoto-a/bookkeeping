import type { PresetKind } from "@prisma/client";

export const PRESET_KIND_LABELS: Record<PresetKind, string> = {
  ONE_SIDE_FIXED: "片側固定",
  TWO_SIDE_FIXED: "両側固定",
};
