"use client";

import { useMemo } from "react";
import type { Answers, Student, AxisScore } from "@/lib/scoring";
import {
  computeReport,
  MAPPING_TABLE,
  MANDATORY_NOTICE,
  SHORT_NAME,
} from "@/lib/scoring";
import { toArabicDigits } from "@/lib/format";

function AxisBars({
  ranked,
  topKeys,
}: {
  ranked: AxisScore[];
  topKeys: string[];
}) {
  return (
    <div className="space-y-3">
      {ranked.map((a) => {
        const isTop = topKeys.includes(a.key);
        return (
          <div key={a.key}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span
                className={
                  isTop ? "font-bold text-teal-700" : "font-medium text-slate-600"
                }
              >
                {a.title}
                <span className="text-slate-400"> ({SHORT_NAME[a.key]})</span>
              </span>
              <span
                className={isTop ? "font-bold text-teal-700" : "text-slate-500"}
              >
                {toArabicDigits(a.score)} / {toArabicDigits(a.max)}
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={[
                  "h-full rounded-full transition-all",
                  isTop ? "bg-teal-600" : "bg-slate-300",
                ].join(" ")}
                style={{ width: `${a.percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ResultsScreen({
  student,
  answers,
  onRestart,
}: {
  student: Student;
  answers: Answers;
  onRestart: () => void;
}) {
  const report = useMemo(
    () => computeReport(student, answers),
    [student, answers],
  );

  const trackLabel =
    student.track === "science" ? "المسار العلمي" : "المسار الأدبي";
  const topKeys = [report.top1.key, report.top2.key];

  return (
    <main className="mx-auto max-w-md px-4 pb-24">
      <div className="print-area">
        {/* الترويسة */}
        <header
          className="mt-8 rounded-3xl px-6 py-7 text-center text-white shadow-lg"
          style={{ background: "linear-gradient(180deg,#0d9488,#0f766e)" }}
        >
          <p className="text-sm font-medium text-teal-50">التقرير النهائي</p>
          <h1 className="mt-1 text-xl font-extrabold">بوصلة التخصص</h1>
          <div className="mt-4 rounded-2xl bg-white/10 px-4 py-3 text-right">
            <div className="flex items-center justify-between text-sm">
              <span className="text-teal-50">الطالب / الطالبة</span>
              <span className="font-bold">{student.name}</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-sm">
              <span className="text-teal-50">المسار</span>
              <span className="font-bold">{trackLabel}</span>
            </div>
          </div>
        </header>

        {/* درجات المحاور */}
        <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 animate-fade-up">
          <h2 className="mb-4 text-base font-bold text-slate-800">
            درجاتك في المحاور الستة
          </h2>
          <AxisBars ranked={report.ranked} topKeys={topKeys} />
        </section>

        {/* أعلى محورين */}
        <section className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-slate-100">
            <p className="text-xs text-slate-400">أعلى محور</p>
            <p className="mt-1 text-sm font-extrabold text-teal-700">
              {report.top1.title}
            </p>
            <p className="mt-1 text-xs font-bold text-slate-500">
              {toArabicDigits(report.top1.score)} / {toArabicDigits(report.top1.max)}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-slate-100">
            <p className="text-xs text-slate-400">ثاني أعلى محور</p>
            <p className="mt-1 text-sm font-extrabold text-teal-700">
              {report.top2.title}
            </p>
            <p className="mt-1 text-xs font-bold text-slate-500">
              {toArabicDigits(report.top2.score)} / {toArabicDigits(report.top2.max)}
            </p>
          </div>
        </section>

        {/* التوصية بالتخصص */}
        <section
          className="mt-4 overflow-hidden rounded-2xl p-5 text-white shadow-md animate-fade-up"
          style={{ background: "linear-gradient(180deg,#059669,#047857)" }}
        >
          <p className="text-sm font-medium text-emerald-50">
            التخصص الأنسب لك وفق المقياس ({report.pairLabel})
          </p>
          <p className="mt-1 text-2xl font-extrabold">{report.primary}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {report.recommended.map((s) => (
              <span
                key={s}
                className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-4 rounded-xl bg-white/10 px-4 py-2.5 text-sm">
            <span className="text-emerald-50">التخصص البديل: </span>
            <span className="font-bold">{report.alternative}</span>
          </div>
        </section>

        {/* ملاحظة شرط التصحيح الخاص */}
        {report.overrideNote && (
          <div className="mt-4 rounded-2xl bg-sky-50 p-4 text-sm leading-relaxed text-sky-800 ring-1 ring-sky-100">
            <b className="block mb-1">توجيه خاص:</b>
            {report.overrideNote}
          </div>
        )}

        {/* الحد الأدنى المتوقع للقبول */}
        <section className="mt-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800">
              الحد الأدنى المتوقع للقبول
            </h2>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
              {report.admission.label}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {report.admission.note}
          </p>
          <p className="mt-2 text-xs text-slate-400">
            * النِّسب تقديرية استرشادية وتتغيّر سنوياً حسب أعداد المتقدمين.
          </p>
        </section>

        {/* نصائح إضافية */}
        <section className="mt-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <h2 className="mb-3 text-base font-bold text-slate-800">
            نصائح إضافية
          </h2>
          <ul className="space-y-2.5 text-sm leading-relaxed text-slate-600">
            {report.advice.map((a, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1 text-teal-600">✓</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* التنبيه الإلزامي */}
        <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm leading-relaxed text-amber-800 ring-1 ring-amber-200">
          <b>⚠️ تنبيه إلزامي: </b>
          {MANDATORY_NOTICE}
        </div>

        {/* الجدول المرجعي */}
        <details className="mt-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <summary className="cursor-pointer text-sm font-bold text-slate-700">
            جدول ربط المحاور بالتخصصات (مرجع)
          </summary>
          <div className="mt-3 divide-y divide-slate-100 text-xs">
            {MAPPING_TABLE.map((row) => {
              const active = row.pair === report.pairLabel;
              return (
                <div
                  key={row.pair}
                  className={[
                    "flex flex-col gap-0.5 py-2",
                    active ? "rounded-lg bg-teal-50 px-2" : "",
                  ].join(" ")}
                >
                  <span
                    className={
                      active
                        ? "font-bold text-teal-700"
                        : "font-bold text-slate-600"
                    }
                  >
                    {row.pair}
                  </span>
                  <span className="text-slate-500">{row.specs}</span>
                </div>
              );
            })}
          </div>
        </details>
      </div>

      {/* أزرار التحكم */}
      <div className="no-print mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => window.print()}
          className="flex-1 rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-teal-700 active:scale-[0.98]"
        >
          طباعة / حفظ PDF
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 active:scale-95"
        >
          إعادة الاختبار
        </button>
      </div>
    </main>
  );
}
