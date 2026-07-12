"use client";

import { LIKERT } from "@/lib/questions";
import { toArabicDigits } from "@/lib/format";

export default function LikertScale({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (v: number) => void;
}) {
  return (
    <div
      className="flex items-stretch gap-1.5 sm:gap-2"
      role="radiogroup"
      aria-label="مقياس الإجابة من ١ إلى ٥"
    >
      {LIKERT.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={opt.label}
            title={opt.label}
            onClick={() => onChange(opt.value)}
            className={[
              "flex-1 aspect-square rounded-xl border text-base font-bold transition-all duration-150 select-none",
              "flex items-center justify-center",
              selected
                ? "bg-teal-600 border-teal-600 text-white shadow-md scale-105"
                : "bg-white border-slate-200 text-slate-500 hover:border-teal-400 hover:text-teal-600 active:scale-95",
            ].join(" ")}
          >
            {toArabicDigits(opt.value)}
          </button>
        );
      })}
    </div>
  );
}
