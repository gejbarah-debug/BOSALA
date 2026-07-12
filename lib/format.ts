// تحويل الأرقام إلى الأرقام العربية (الهندية) ٠١٢٣٤٥٦٧٨٩
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

export function toArabicDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => ARABIC_DIGITS[Number(d)]);
}
