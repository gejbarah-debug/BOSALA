"use client";

import { useState } from "react";
import type { Student, Track } from "@/lib/scoring";
import { AXES, TOTAL_STATEMENTS } from "@/lib/questions";
import { toArabicDigits } from "@/lib/format";

function CompassIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        opacity="0.35"
      />
      <circle cx="50" cy="50" r="4" fill="currentColor" />
      <polygon points="50,14 60,50 50,42 40,50" fill="currentColor" />
      <polygon points="50,86 40,50 50,58 60,50" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

const TRACKS: { value: Track; label: string; hint: string }[] = [
  { value: "science", label: "علمي", hint: "رياضيات وعلوم" },
  { value: "literary", label: "أدبي", hint: "لغات وإنسانيات" },
];

export default function IntroScreen({
  onStart,
}: {
  onStart: (s: Student) => void;
}) {
  const [name, setName] = useState("");
  const [track, setTrack] = useState<Track | null>(null);
  const [error, setError] = useState("");

  function start() {
    if (!name.trim()) {
      setError("الرجاء إدخال الاسم أولاً.");
      return;
    }
    if (!track) {
      setError("الرجاء اختيار المسار (علمي أو أدبي).");
      return;
    }
    onStart({ name: name.trim(), track });
  }

  return (
    <main className="mx-auto max-w-md px-4 pb-16">
      {/* الترويسة */}
      <header
        className="mt-8 rounded-3xl px-6 py-8 text-center text-white shadow-lg"
        style={{ background: "linear-gradient(180deg,#0d9488,#0f766e)" }}
      >
        <CompassIcon className="mx-auto h-20 w-20 text-white" />
        <h1 className="mt-3 text-2xl font-extrabold leading-snug">
          بوصلة التخصص
        </h1>
        <p className="mt-1 text-sm font-medium text-teal-50">
          لطلبة الصف الثاني عشر — علمي وأدبي
        </p>
      </header>

      {/* آلية العمل */}
      <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <h2 className="mb-3 text-base font-bold text-slate-800">
          كيف يعمل الاستبيان؟
        </h2>
        <ul className="space-y-2.5 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-teal-600">◆</span>
            <span>
              يتكوّن من <b className="text-slate-800">{toArabicDigits(AXES.length)}</b> محاور،
              وإجمالي <b className="text-slate-800">{toArabicDigits(TOTAL_STATEMENTS)}</b> عبارة.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-teal-600">◆</span>
            <span>
              تُجاب كل عبارة بمقياس من <b className="text-slate-800">٥</b> نقاط
              (١ = لا ينطبق أبداً، ٥ = ينطبق بشدة).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-teal-600">◆</span>
            <span>
              في النهاية نحسب أعلى محورين ونستخرج التخصص الجامعي الأنسب لك.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-teal-600">◆</span>
            <span>المدة المتوقعة: ٧ – ١٠ دقائق تقريباً.</span>
          </li>
        </ul>
      </section>

      {/* بيانات الطالب */}
      <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <label
          htmlFor="student-name"
          className="mb-2 block text-sm font-bold text-slate-800"
        >
          اسم الطالب / الطالبة
        </label>
        <input
          id="student-name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError("");
          }}
          placeholder="اكتب اسمك هنا"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
        />

        <p className="mt-5 mb-2 text-sm font-bold text-slate-800">
          المسار الدراسي
        </p>
        <div className="grid grid-cols-2 gap-3">
          {TRACKS.map((t) => {
            const active = track === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => {
                  setTrack(t.value);
                  if (error) setError("");
                }}
                className={[
                  "rounded-xl border-2 px-4 py-3 text-center transition",
                  active
                    ? "border-teal-600 bg-teal-50"
                    : "border-slate-200 bg-white hover:border-teal-300",
                ].join(" ")}
              >
                <span
                  className={[
                    "block text-lg font-extrabold",
                    active ? "text-teal-700" : "text-slate-700",
                  ].join(" ")}
                >
                  {t.label}
                </span>
                <span className="mt-0.5 block text-xs text-slate-400">
                  {t.hint}
                </span>
              </button>
            );
          })}
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={start}
          className="mt-6 w-full rounded-xl bg-teal-600 px-5 py-3.5 text-base font-bold text-white shadow-md transition hover:bg-teal-700 active:scale-[0.98]"
        >
          ابدأ الاستبيان
        </button>
      </section>

      <p className="mt-6 px-2 text-center text-xs leading-relaxed text-slate-400">
        هذا المقياس استرشادي لمساعدتك على التفكير في مستقبلك الأكاديمي، ولا يُغني
        عن استشارة مكتب التوجيه وعمادة القبول بجامعة الكويت.
      </p>
    </main>
  );
}
