// إرسال نتيجة الطالب إلى قاعدة البيانات عند إنهاء الاستبيان

import type { Answers, Student } from "./scoring";
import { computeReport } from "./scoring";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./supabase";

export async function submitResult(
  student: Student,
  answers: Answers,
  completedAt: string | null,
): Promise<void> {
  const report = computeReport(student, answers);

  const scores: Record<string, number> = {};
  for (const s of report.scores) scores[s.key] = s.score;

  const payload = {
    name: student.name,
    track: student.track,
    completed_at: completedAt,
    scores,
    top1: report.top1.title,
    top2: report.top2.title,
    pair_label: report.pairLabel,
    primary_specialization: report.primary,
    alternative_specialization: report.alternative,
    recommended: report.recommended,
    answers,
  };

  await fetch(`${SUPABASE_URL}/rest/v1/submissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify(payload),
  });
}
