"use client";

import { useMemo, useState } from "react";
import { AXES, TOTAL_STATEMENTS } from "@/lib/questions";
import type { Answers } from "@/lib/scoring";
import { toArabicDigits } from "@/lib/format";
import LikertScale from "./LikertScale";
import Logo from "./Logo";
import LiveClock from "./LiveClock";

export default function Questionnaire({
  answers,
  setAnswers,
  onComplete,
  onExit,
}: {
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  onComplete: () => void;
  onExit: () => void;
}) {
  const [axisIndex, setAxisIndex] = useState(0);
  const [showError, setShowError] = useState(false);

  const axis = AXES[axisIndex];
  const total = AXES.length;

  const answeredInAxis = answers[axis.key].filter((v) => v !== null).length;
  const allAnswered = answeredInAxis === axis.statements.length;

  const totalAnswered = useMemo(
    () =>
      AXES.reduce(
        (n, a) => n + answers[a.key].filter((v) => v !== null).length,
        0,
      ),
    [answers],
  );
  const progress = Math.round((totalAnswered / TOTAL_STATEMENTS) * 100);

  function setAnswer(i: number, val: number) {
    setAnswers((prev) => {
      const nextAxis = [...prev[axis.key]];
      nextAxis[i] = val;
      return { ...prev, [axis.key]: nextAxis };
    });
  }

  function goNext() {
    if (!allAnswered) {
      setShowError(true);
      const firstUnanswered = answers[axis.key].findIndex((v) => v === null);
      if (firstUnanswered >= 0) {
        document
          .getElementById(`q-${firstUnanswered}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    setShowError(false);
    if (axisIndex < total - 1) {
      setAxisIndex(axisIndex + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      onComplete();
    }
  }

  function goPrev() {
    setShowError(false);
    if (axisIndex > 0) {
      setAxisIndex(axisIndex - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      onExit();
    }
  }

  const isLast = axisIndex === total - 1;

  return (
    <div className="mx-auto max-w-md px-4 pb-28">
      {/* الترويسة الثابتة */}
      <div className="sticky top-0 z-10 -mx-4 bg-[#faf5ee]/95 px-4 pb-3 pt-4 backdrop-blur">
        <div className="mb-2 flex items-center justify-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-slate-100">
            <Logo className="h-full w-full p-0.5" />
          </span>
          <span className="text-xs font-bold text-[#1c3f63]">
            الأمل والنور — بوصلة التخصص
          </span>
        </div>

        <div className="mb-2">
          <LiveClock compact />
        </div>

        <div className="flex items-center justify-between text-xs font-medium text-slate-500">
          <span>
            المحور {toArabicDigits(axisIndex + 1)} من {toArabicDigits(total)}
          </span>
          <span>{toArabicDigits(progress)}٪ مكتمل</span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-[#e87a28] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1c3f63] text-sm font-bold text-white">
              {toArabicDigits(axis.id)}
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-sm font-bold text-[#1c3f63]">
                {axis.title}
              </h2>
              <p className="truncate text-xs text-slate-400">{axis.subtitle}</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between gap-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <b className="text-[#e87a28]">١</b> لا ينطبق أبداً
            </span>
            <span className="flex items-center gap-1">
              ينطبق بشدة <b className="text-[#e87a28]">٥</b>
            </span>
          </div>
        </div>
      </div>

      {showError && (
        <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600 animate-fade-up">
          الرجاء الإجابة على جميع العبارات للمتابعة (تبقّى{" "}
          {toArabicDigits(axis.statements.length - answeredInAxis)}).
        </p>
      )}

      {/* العبارات */}
      <div className="mt-4 space-y-3">
        {axis.statements.map((statement, i) => {
          const value = answers[axis.key][i];
          const missing = showError && value === null;
          return (
            <div
              key={i}
              id={`q-${i}`}
              className={[
                "rounded-2xl bg-white p-4 shadow-sm ring-1 transition",
                missing ? "ring-2 ring-rose-300" : "ring-slate-100",
              ].join(" ")}
            >
              <div className="mb-3 flex items-start gap-2">
                <span className="mt-0.5 shrink-0 text-sm font-bold text-[#e87a28]">
                  {toArabicDigits(i + 1)}.
                </span>
                <p className="text-sm font-medium leading-relaxed text-[#1c3f63]">
                  {statement}
                </p>
              </div>
              <LikertScale value={value} onChange={(v) => setAnswer(i, v)} />
            </div>
          );
        })}
      </div>

      {/* شريط التنقل السفلي */}
      <div className="no-print fixed inset-x-0 bottom-0 z-10 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <button
            type="button"
            onClick={goPrev}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 active:scale-95"
          >
            {axisIndex === 0 ? "رجوع" : "السابق"}
          </button>
          <button
            type="button"
            onClick={goNext}
            className={[
              "flex-1 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-md transition active:scale-[0.98]",
              isLast
                ? "bg-[#1c3f63] hover:bg-[#14304d]"
                : "bg-[#e87a28] hover:bg-[#d3661a]",
            ].join(" ")}
          >
            {isLast ? "عرض النتيجة" : "المحور التالي"}
          </button>
        </div>
      </div>
    </div>
  );
}
