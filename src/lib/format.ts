/** 15_000_000 → "15 triệu"; 7_500_000 → "7,5 triệu"; 800_000 → "800.000 ₫" */
export function formatPriceVnd(vnd: number): string {
  if (vnd >= 1_000_000) {
    const millions = (vnd / 1_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 1 });
    return `${millions} triệu`;
  }
  return `${vnd.toLocaleString("vi-VN")} ₫`;
}
