// تحويل الأرقام إلى الأرقام العربية (الهندية) ٠١٢٣٤٥٦٧٨٩
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

export function toArabicDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => ARABIC_DIGITS[Number(d)]);
}

// تنسيق التاريخ والوقت بتوقيت الكويت (Asia/Kuwait) بغضّ النظر عن توقيت جهاز المستخدم
export function formatKuwait(
  date: Date,
  opts?: { seconds?: boolean },
): { dateStr: string; timeStr: string } {
  const dateStr = new Intl.DateTimeFormat("ar", {
    timeZone: "Asia/Kuwait",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  const timeStr = new Intl.DateTimeFormat("ar", {
    timeZone: "Asia/Kuwait",
    hour: "2-digit",
    minute: "2-digit",
    ...(opts?.seconds ? { second: "2-digit" } : {}),
    hour12: true,
  }).format(date);
  return { dateStr, timeStr };
}
