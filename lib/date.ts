/**
 * "YYYYMM" 形式の文字列を { year, month } にパースする。
 * 不正な値やundefinedの場合は現在の年月を返す。
 */
export const parseMonth = (param?: string): { year: number; month: number } => {
  const now = new Date();
  if (param && /^\d{6}$/.test(param)) {
    const year = Number(param.slice(0, 4));
    const month = Number(param.slice(4, 6));
    if (month >= 1 && month <= 12) return { year, month };
  }
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
};
