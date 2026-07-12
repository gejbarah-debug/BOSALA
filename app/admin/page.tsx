"use client";

import { useEffect, useState } from "react";
import { AXES, LIKERT } from "@/lib/questions";
import { ADMIN_FUNCTION_URL, SUPABASE_ANON_KEY } from "@/lib/supabase";
import { formatKuwait } from "@/lib/format";
import { toArabicDigits } from "@/lib/format";
import Logo from "@/components/Logo";

interface Submission {
  id: string;
  created_at: string;
  name: string;
  track: "science" | "literary";
  completed_at: string | null;
  scores: Record<string, number>;
  top1: string;
  top2: string;
  pair_label: string | null;
  primary_specialization: string;
  alternative_specialization: string | null;
  recommended: string[] | null;
  answers: Record<string, (number | null)[]>;
}

const PW_KEY = "alnoor_admin_pw";

function trackLabel(t: string) {
  return t === "science" ? "علمي" : "أدبي";
}

function fmt(iso: string | null) {
  if (!iso) return "—";
  const { dateStr, timeStr } = formatKuwait(new Date(iso));
  return `${dateStr} · ${timeStr}`;
}

function likertShort(v: number | null | undefined) {
  if (v == null) return "—";
  return LIKERT.find((l) => l.value === v)?.short ?? String(v);
}

function toCSV(rows: Submission[]): string {
  const axisKeys = AXES.map((a) => a.key);
  const header = [
    "الاسم",
    "المسار",
    "وقت الإجراء",
    "التخصص الأنسب",
    "التخصص البديل",
    "أعلى محور",
    "ثاني محور",
    ...AXES.map((a) => `درجة ${a.title}`),
    ...AXES.flatMap((a) => a.statements.map((_, i) => `${a.title} ${i + 1}`)),
  ];
  const esc = (v: unknown) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = rows.map((r) => {
    const scoreCols = axisKeys.map((k) => r.scores?.[k] ?? "");
    const answerCols = AXES.flatMap((a) =>
      (r.answers?.[a.key] ?? []).map((v) => v ?? ""),
    );
    return [
      r.name,
      trackLabel(r.track),
      fmt(r.completed_at),
      r.primary_specialization,
      r.alternative_specialization ?? "",
      r.top1,
      r.top2,
      ...scoreCols,
      ...answerCols,
    ]
      .map(esc)
      .join(",");
  });
  return [header.map(esc).join(","), ...lines].join("\n");
}

export default function AdminPage() {
  const [pw, setPw] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rows, setRows] = useState<Submission[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  async function load(password: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(ADMIN_FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });
      if (res.status === 401) {
        setError("كلمة المرور غير صحيحة.");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError("تعذّر جلب البيانات، حاول مرة أخرى.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setRows((data.submissions as Submission[]) ?? []);
      setAuthed(true);
      try {
        sessionStorage.setItem(PW_KEY, password);
      } catch {}
    } catch {
      setError("تعذّر الاتصال بالخادم.");
    }
    setLoading(false);
  }

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = sessionStorage.getItem(PW_KEY);
    } catch {}
    if (saved) {
      setPw(saved);
      load(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function logout() {
    setAuthed(false);
    setRows([]);
    setPw("");
    try {
      sessionStorage.removeItem(PW_KEY);
    } catch {}
  }

  function exportCSV() {
    const blob = new Blob(["﻿" + toCSV(rows)], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "alnoor-bosala-submissions.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  // ===== شاشة الدخول =====
  if (!authed) {
    return (
      <main className="mx-auto flex min-h-[100dvh] max-w-sm flex-col justify-center px-5">
        <div className="rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-100">
          <Logo className="mx-auto h-20 w-auto" />
          <h1 className="mt-2 text-lg font-extrabold text-[#1c3f63]">
            لوحة المشرف
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            الأمل والنور — بوصلة التخصص
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              load(pw);
            }}
            className="mt-5 text-right"
          >
            <label
              htmlFor="admin-pw"
              className="mb-2 block text-sm font-bold text-[#1c3f63]"
            >
              كلمة مرور المشرف
            </label>
            <input
              id="admin-pw"
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[#1c3f63] outline-none transition focus:border-[#e87a28] focus:bg-white focus:ring-2 focus:ring-[#e87a28]/20"
            />
            {error && (
              <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="mt-5 w-full rounded-xl bg-[#e87a28] px-5 py-3 text-base font-bold text-white shadow-md transition hover:bg-[#d3661a] active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? "جارٍ الدخول…" : "دخول"}
            </button>
          </form>
        </div>
        <p className="mt-5 text-center text-xs text-slate-400">
          هذه الصفحة مخصّصة لإدارة المركز فقط.
        </p>
      </main>
    );
  }

  // ===== لوحة النتائج =====
  return (
    <main className="mx-auto max-w-2xl px-4 pb-16">
      <header
        className="mt-6 flex items-center gap-3 rounded-3xl px-5 py-4 text-white shadow-lg"
        style={{ background: "linear-gradient(160deg,#245080,#152f4c)" }}
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
          <Logo className="h-10 w-10 p-0.5" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-base font-extrabold">لوحة المشرف</h1>
          <p className="text-xs text-white/75">الأمل والنور — بوصلة التخصص</p>
        </div>
        <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-bold">
          {toArabicDigits(rows.length)} نتيجة
        </span>
      </header>

      <div className="no-print mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => load(pw)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-[#1c3f63] transition hover:bg-slate-50"
        >
          تحديث
        </button>
        <button
          type="button"
          onClick={exportCSV}
          disabled={rows.length === 0}
          className="rounded-xl bg-[#e87a28] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#d3661a] disabled:opacity-50"
        >
          تصدير CSV (Excel)
        </button>
        <button
          type="button"
          onClick={logout}
          className="mr-auto rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-500 transition hover:bg-slate-50"
        >
          خروج
        </button>
      </div>

      {loading && (
        <p className="mt-6 text-center text-sm text-slate-500">جارٍ التحميل…</p>
      )}

      {!loading && rows.length === 0 && (
        <p className="mt-10 text-center text-sm text-slate-400">
          لا توجد نتائج بعد. ستظهر هنا فور إكمال الطلبة للاستبيان.
        </p>
      )}

      <div className="mt-4 space-y-3">
        {rows.map((r, idx) => {
          const open = openId === r.id;
          return (
            <div
              key={r.id}
              className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">
                      {toArabicDigits(idx + 1)}
                    </span>
                    <h2 className="truncate font-bold text-[#1c3f63]">
                      {r.name}
                    </h2>
                    <span
                      className={[
                        "rounded-full px-2 py-0.5 text-[11px] font-bold",
                        r.track === "science"
                          ? "bg-sky-100 text-sky-700"
                          : "bg-violet-100 text-violet-700",
                      ].join(" ")}
                    >
                      {trackLabel(r.track)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    التخصص الأنسب:{" "}
                    <b className="text-[#d3661a]">{r.primary_specialization}</b>
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {r.pair_label ?? `${r.top1} + ${r.top2}`}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {fmt(r.completed_at)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : r.id)}
                  className="shrink-0 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-[#1c3f63] transition hover:bg-slate-50"
                >
                  {open ? "إخفاء" : "التفاصيل"}
                </button>
              </div>

              {open && (
                <div className="mt-3 space-y-3 border-t border-slate-100 pt-3">
                  <div className="flex flex-wrap gap-2">
                    {AXES.map((a) => (
                      <span
                        key={a.key}
                        className="rounded-lg bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600"
                      >
                        {a.title}:{" "}
                        <b className="text-[#1c3f63]">
                          {toArabicDigits(r.scores?.[a.key] ?? 0)}
                        </b>
                        /٥٠
                      </span>
                    ))}
                  </div>

                  {AXES.map((a) => (
                    <div key={a.key}>
                      <p className="mb-1 text-xs font-bold text-[#1c3f63]">
                        {a.title}
                      </p>
                      <ul className="space-y-0.5">
                        {a.statements.map((st, i) => {
                          const v = r.answers?.[a.key]?.[i];
                          return (
                            <li
                              key={i}
                              className="flex items-start justify-between gap-2 text-[11px] text-slate-500"
                            >
                              <span className="min-w-0">
                                {toArabicDigits(i + 1)}. {st}
                              </span>
                              <span className="shrink-0 font-bold text-[#d3661a]">
                                {toArabicDigits(v ?? 0)} · {likertShort(v)}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
