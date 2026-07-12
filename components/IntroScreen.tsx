"use client";

import { useState } from "react";
import type { Student, Track } from "@/lib/scoring";
import { AXES, TOTAL_STATEMENTS } from "@/lib/questions";
import { toArabicDigits } from "@/lib/format";
import Logo from "./Logo";
import BrandFooter from "./BrandFooter";
import LiveClock from "./LiveClock";

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
    <main className="mx-auto max-w-md px-4 pb-12">
      {/* ترويسة العلامة */}
      <header className="mt-6 rounded-3xl bg-white px-6 py-7 text-center shadow-sm ring-1 ring-slate-100">
        <Logo className="mx-auto h-24 w-auto" />
        <h1 className="mt-2 text-xl font-extrabold text-[#1c3f63]">
          الأمل والنور للاستشارات
        </h1>
        <div className="mx-auto my-3 h-1 w-16 rounded-full bg-[#e87a28]" />
        <p className="text-2xl font-extrabold text-[#e87a28]">بوصلة التخصص</p>
        <p className="mt-1 text-sm font-medium text-slate-500">
          لطلبة الصف الثاني عشر — علمي وأدبي
        </p>
      </header>

      <LiveClock />

      {/* آلية العمل */}
      <section className="mt-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <h2 className="mb-3 text-base font-bold text-[#1c3f63]">
          كيف يعمل الاستبيان؟
        </h2>
        <ul className="space-y-2.5 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-[#e87a28]">◆</span>
            <span>
              يتكوّن من{" "}
              <b className="text-[#1c3f63]">{toArabicDigits(AXES.length)}</b>{" "}
              محاور، وإجمالي{" "}
              <b className="text-[#1c3f63]">
                {toArabicDigits(TOTAL_STATEMENTS)}
              </b>{" "}
              عبارة.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-[#e87a28]">◆</span>
            <span>
              تُجاب كل عبارة بمقياس من <b className="text-[#1c3f63]">٥</b> نقاط
              (١ = لا ينطبق أبداً، ٥ = ينطبق بشدة).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-[#e87a28]">◆</span>
            <span>
              في النهاية نحسب أعلى محورين ونستخرج التخصص الجامعي الأنسب لك.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-[#e87a28]">◆</span>
            <span>المدة المتوقعة: ٧ – ١٠ دقائق تقريباً.</span>
          </li>
        </ul>
      </section>

      {/* بيانات الطالب */}
      <section className="mt-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <label
          htmlFor="student-name"
          className="mb-2 block text-sm font-bold text-[#1c3f63]"
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
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[#1c3f63] outline-none transition focus:border-[#e87a28] focus:bg-white focus:ring-2 focus:ring-[#e87a28]/20"
        />

        <p className="mt-5 mb-2 text-sm font-bold text-[#1c3f63]">
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
                    ? "border-[#e87a28] bg-[#e87a28]/10"
                    : "border-slate-200 bg-white hover:border-[#e87a28]/50",
                ].join(" ")}
              >
                <span
                  className={[
                    "block text-lg font-extrabold",
                    active ? "text-[#d3661a]" : "text-[#1c3f63]",
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
          className="mt-6 w-full rounded-xl bg-[#e87a28] px-5 py-3.5 text-base font-bold text-white shadow-md transition hover:bg-[#d3661a] active:scale-[0.98]"
        >
          ابدأ الاستبيان
        </button>
      </section>

      <BrandFooter />
    </main>
  );
}
