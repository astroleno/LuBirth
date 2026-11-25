export function formatCivilDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return `${year} 年 ${month} 月 ${day} 日`;
}
