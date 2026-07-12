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
      className="flex items-start gap-1.5 sm:gap-2"
      role="radiogroup"
      aria-label="مقياس الإجابة من ١ (لا ينطبق أبداً) إلى ٥ (ينطبق بشدة)"
    >
      {LIKERT.map((opt) => {
        const selected = value === opt.value;
        return (
          <div
            key={opt.value}
            className="flex flex-1 flex-col items-center gap-1"
          >
            <button
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={opt.label}
              title={opt.label}
              onClick={() => onChange(opt.value)}
              className={[
                "flex aspect-square w-full items-center justify-center rounded-xl border text-base font-bold transition-all duration-150 select-none",
                selected
                  ? "bg-[#e87a28] border-[#e87a28] text-white shadow-md scale-105"
                  : "bg-white border-slate-200 text-slate-500 hover:border-[#e87a28]/60 hover:text-[#e87a28] active:scale-95",
              ].join(" ")}
            >
              {toArabicDigits(opt.value)}
            </button>
            <span
              className={[
                "text-center text-[10px] leading-tight",
                selected ? "font-bold text-[#d3661a]" : "text-slate-400",
              ].join(" ")}
            >
              {opt.short}
            </span>
          </div>
        );
      })}
    </div>
  );
}
