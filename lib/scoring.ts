// محرّك التصحيح واستخراج التخصص الأنسب

import { AXES, AxisKey, ENGLISH } from "./questions";

export type Track = "science" | "literary";

export interface Student {
  name: string;
  track: Track;
}

// إجابات كل محور: مصفوفة من 10 قيم (1..5) أو null إن لم يُجب بعد
export type Answers = Record<AxisKey, (number | null)[]>;

export interface AxisScore {
  key: AxisKey;
  title: string;
  english: string;
  score: number; // 10..50
  max: number; // 50
  percent: number; // 0..100 داخل المحور
}

export interface Report {
  scores: AxisScore[]; // بترتيب المحاور
  ranked: AxisScore[]; // تنازلياً حسب الدرجة
  top1: AxisScore;
  top2: AxisScore;
  topTwoSum: number; // 20..100
  pairLabel: string; // مثل: «المعرفي + المهني»
  recommended: string[]; // قائمة التخصصات المقترحة
  primary: string; // التخصص الأنسب
  alternative: string; // التخصص البديل
  mapped: boolean; // هل التركيبة مدرجة في الجدول
  overrideNote?: string; // ملاحظة شرط تصحيح خاص
  tie: boolean; // تعادل عند حدود أعلى محورين
  englishProficiency: number; // 1..5
  admission: { label: string; note: string };
  advice: string[];
  track: Track;
}

// الأسماء المختصرة للمحاور (لعرض التركيبة)
export const SHORT_NAME: Record<AxisKey, string> = {
  interests: "المعرفي",
  career: "المهني",
  abilities: "الكفاءات",
  personality: "الشخصية",
  academic: "الأكاديمي",
  employment: "التوافق الوظيفي",
};

function pairKey(a: AxisKey, b: AxisKey): string {
  return [a, b].sort().join("+");
}

// جدول ربط أعلى محورين بالتخصصات (جامعة الكويت)
const PAIR_MAP: Record<string, string[]> = {
  [pairKey("interests", "career")]: ["الطب", "طب الأسنان", "الصيدلة"],
  [pairKey("interests", "abilities")]: ["الهندسة (جميع فروعها)", "العمارة"],
  [pairKey("career", "personality")]: ["القانون", "العلوم السياسية"],
  [pairKey("abilities", "academic")]: ["علوم الحاسوب", "نظم المعلومات"],
  [pairKey("personality", "abilities")]: [
    "الإعلام",
    "العلاقات العامة",
    "الترجمة",
  ],
  [pairKey("employment", "career")]: ["إدارة الأعمال", "المحاسبة", "التمويل"],
  [pairKey("interests", "personality")]: ["علم النفس", "الخدمة الاجتماعية"],
  [pairKey("academic", "interests")]: ["الرياضيات", "الفيزياء", "الكيمياء"],
  [pairKey("career", "academic")]: ["التربية", "التعليم الأساسي"],
  [pairKey("employment", "personality")]: ["السياحة والفنادق", "التسويق"],
};

// تخصصات مرتبطة بكل محور منفرداً (تُستخدم كبديل عند عدم إدراج التركيبة)
const AXIS_SPECS: Record<AxisKey, string[]> = {
  interests: ["الطب", "العلوم", "الهندسة"],
  career: ["إدارة الأعمال", "التعليم", "القانون"],
  abilities: ["الهندسة", "علوم الحاسوب"],
  personality: ["علم النفس", "الإعلام"],
  academic: ["الرياضيات", "الفيزياء"],
  employment: ["إدارة الأعمال", "الطب"],
};

function fallbackSpecs(a: AxisKey, b: AxisKey): string[] {
  return Array.from(new Set([...AXIS_SPECS[a], ...AXIS_SPECS[b]]));
}

// الجدول المرجعي الكامل (للعرض في التقرير)
export const MAPPING_TABLE: { pair: string; specs: string }[] = [
  { pair: "المعرفي + المهني", specs: "الطب - طب الأسنان - الصيدلة" },
  { pair: "المعرفي + الكفاءات", specs: "الهندسة (جميع فروعها) - العمارة" },
  { pair: "المهني + الشخصية", specs: "القانون - العلوم السياسية" },
  { pair: "الكفاءات + الأكاديمي", specs: "علوم الحاسوب - نظم المعلومات" },
  { pair: "الشخصية + الكفاءات", specs: "الإعلام - العلاقات العامة - الترجمة" },
  { pair: "التوافق الوظيفي + المهني", specs: "إدارة الأعمال - المحاسبة - التمويل" },
  { pair: "المعرفي + الشخصية", specs: "علم النفس - الخدمة الاجتماعية" },
  { pair: "الأكاديمي + المعرفي", specs: "الرياضيات - الفيزياء - الكيمياء" },
  { pair: "المهني + الأكاديمي", specs: "التربية - التعليم الأساسي" },
  { pair: "التوافق الوظيفي + الشخصية", specs: "السياحة والفنادق - التسويق" },
];

export const MANDATORY_NOTICE =
  "تنبيه: هذا المقياس توجيهي استرشادي فقط، والقبول النهائي يخضع للمعدل المكافئ والأعداد المقررة من عمادة القبول والتسجيل بجامعة الكويت.";

// الحد الأدنى المتوقع للقبول (نطاق تقديري استرشادي يتغير سنوياً)
function admissionFor(primary: string): { label: string; note: string } {
  const has = (s: string) => primary.includes(s);
  if (has("طب") || has("صيدلة") || has("أسنان"))
    return {
      label: "تنافسي جداً",
      note: "يتطلب معدلاً مكافئاً مرتفعاً جداً (غالباً ٨٨٪ فأعلى للمسار العلمي) مع إجادة اللغة الإنجليزية.",
    };
  if (has("هندسة") || has("عمارة"))
    return {
      label: "تنافسي",
      note: "يتطلب معدلاً مكافئاً مرتفعاً (غالباً ٨٠٪ فأعلى للمسار العلمي) وأساساً قوياً في الرياضيات والفيزياء.",
    };
  if (has("حاسوب") || has("نظم المعلومات") || has("برمجة"))
    return {
      label: "تنافسي",
      note: "يتطلب معدلاً مكافئاً جيداً (غالباً ٧٨٪ فأعلى) ومهارات منطقية ورياضية.",
    };
  if (has("قانون") || has("سياسية"))
    return {
      label: "مرتفع",
      note: "قبول تنافسي للمسار الأدبي (غالباً ٧٥٪ فأعلى) مع قوة في اللغة العربية والتعبير.",
    };
  if (has("إعلام") || has("علاقات") || has("ترجمة"))
    return {
      label: "متوسط إلى مرتفع",
      note: "يتطلب مهارات لغوية وتواصلية قوية؛ ويختلف المعدل المكافئ حسب القسم.",
    };
  if (has("إدارة") || has("محاسبة") || has("تمويل") || has("تسويق"))
    return {
      label: "متوسط إلى مرتفع",
      note: "قبول تنافسي في كلية العلوم الإدارية (غالباً ٧٥٪ فأعلى).",
    };
  if (has("رياضيات") || has("فيزياء") || has("كيمياء") || has("العلوم"))
    return {
      label: "متوسط",
      note: "كلية العلوم؛ المعدل المكافئ متوسط ويعتمد على القسم.",
    };
  if (has("نفس") || has("اجتماعية"))
    return {
      label: "متوسط",
      note: "كلية العلوم الاجتماعية؛ معدل مكافئ متوسط.",
    };
  if (has("تربية") || has("تعليم"))
    return {
      label: "متوسط",
      note: "كلية التربية؛ معدل مكافئ متوسط مع اجتياز المقابلات إن وُجدت.",
    };
  if (has("سياحة") || has("فنادق"))
    return { label: "متوسط", note: "معدل مكافئ متوسط." };
  return {
    label: "يختلف حسب التخصص",
    note: "راجع عمادة القبول والتسجيل لمعرفة المعدل المكافئ للسنة الحالية.",
  };
}

function axisOrder(key: AxisKey): number {
  return AXES.findIndex((a) => a.key === key);
}

export function computeReport(student: Student, answers: Answers): Report {
  // 1) جمع درجات كل محور
  const scores: AxisScore[] = AXES.map((ax) => {
    const vals = answers[ax.key].map((v) => v ?? 0);
    const score = vals.reduce((a, b) => a + b, 0);
    const max = ax.statements.length * 5;
    return {
      key: ax.key,
      title: ax.title,
      english: ax.english,
      score,
      max,
      percent: Math.round((score / max) * 100),
    };
  });

  // 2) الترتيب التنازلي (وعند التعادل نحافظ على ترتيب المحاور الأصلي)
  const ranked = [...scores].sort(
    (a, b) => b.score - a.score || axisOrder(a.key) - axisOrder(b.key),
  );

  const top1 = ranked[0];
  const top2 = ranked[1];
  const topTwoSum = top1.score + top2.score;
  const pairLabel = `${SHORT_NAME[top1.key]} + ${SHORT_NAME[top2.key]}`;

  const byKey = Object.fromEntries(scores.map((s) => [s.key, s.score])) as Record<
    AxisKey,
    number
  >;

  const key = pairKey(top1.key, top2.key);
  const mapped = Boolean(PAIR_MAP[key]);
  let recommended = mapped
    ? [...PAIR_MAP[key]]
    : fallbackSpecs(top1.key, top2.key);

  const englishProficiency = answers.abilities[ENGLISH.index] ?? 0;

  // 3) شروط التصحيح الخاصة بالبيئة الكويتية
  let overrideNote: string | undefined;

  if (
    student.track === "science" &&
    topTwoSum >= 80 &&
    englishProficiency >= 4
  ) {
    if (byKey.abilities >= byKey.career) {
      recommended = ["الهندسة (جميع فروعها)", "العمارة"];
      overrideNote =
        "أداؤك العلمي مرتفع (مجموع أعلى محورين ≥ ٨٠ مع إجادة الإنجليزية)، لذا يُوجَّه المسار العلمي المتميز نحو الهندسة.";
    } else {
      recommended = ["الطب", "طب الأسنان", "الصيدلة"];
      overrideNote =
        "أداؤك العلمي مرتفع (مجموع أعلى محورين ≥ ٨٠ مع إجادة الإنجليزية)، لذا يُوجَّه المسار العلمي المتميز نحو الطب.";
    }
  } else if (
    student.track === "literary" &&
    byKey.personality + byKey.employment >= 80
  ) {
    if (byKey.abilities >= byKey.career) {
      recommended = ["الإعلام", "العلاقات العامة", "الترجمة"];
      overrideNote =
        "مجموع محوري الشخصية والتوافق الوظيفي مرتفع (≥ ٨٠) في المسار الأدبي، لذا يُوجَّه نحو الإعلام.";
    } else {
      recommended = ["القانون", "العلوم السياسية"];
      overrideNote =
        "مجموع محوري الشخصية والتوافق الوظيفي مرتفع (≥ ٨٠) في المسار الأدبي، لذا يُوجَّه نحو القانون.";
    }
  }

  // 4) كشف التعادل عند حدود أعلى محورين (المركز الثاني مع الثالث)
  const tie = ranked.length > 2 && ranked[1].score === ranked[2].score;

  const primary = recommended[0];
  const alternative = recommended[1] ?? recommended[0];
  const admission = admissionFor(primary);

  // 5) النصائح
  const advice: string[] = [];
  if (student.track === "science" && englishProficiency < 4) {
    advice.push(
      "عزّز مهاراتك في اللغة الإنجليزية، فهي شرط أساسي لتخصصات الطب والهندسة وعلوم الحاسوب.",
    );
  }
  if (tie) {
    advice.push(
      "تعادل محورك الثاني مع محور آخر؛ ننصح بزيارة مكتب التوجيه الجامعي بجامعة الكويت لإجراء اختبار مهني معتمد (مثل اختبار «القيم في العمل»).",
    );
  }
  if (!mapped && !overrideNote) {
    advice.push(
      "تركيبة أعلى محورين لديك غير مدرجة مباشرة في جدول التخصصات، لذا اعتبر هذه النتيجة استرشادية وراجع مكتب التوجيه.",
    );
  }
  advice.push(
    "تأكّد من المعدل المكافئ والأعداد المقررة لهذا التخصص من عمادة القبول والتسجيل للسنة الحالية.",
  );

  return {
    scores,
    ranked,
    top1,
    top2,
    topTwoSum,
    pairLabel,
    recommended,
    primary,
    alternative,
    mapped,
    overrideNote,
    tie,
    englishProficiency,
    admission,
    advice,
    track: student.track,
  };
}
