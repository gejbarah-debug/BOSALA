"use client";

import { useEffect, useState } from "react";
import { AXES } from "@/lib/questions";
import type { Answers, Student } from "@/lib/scoring";
import IntroScreen from "@/components/IntroScreen";
import Questionnaire from "@/components/Questionnaire";
import ResultsScreen from "@/components/ResultsScreen";

type Step = "intro" | "quiz" | "results";

const STORAGE_KEY = "bosala_state_v1";

function emptyAnswers(): Answers {
  return AXES.reduce((acc, ax) => {
    acc[ax.key] = Array(ax.statements.length).fill(null);
    return acc;
  }, {} as Answers);
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>("intro");
  const [student, setStudent] = useState<Student | null>(null);
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [completedAt, setCompletedAt] = useState<string | null>(null);

  // استرجاع التقدم المحفوظ
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as {
          step?: Step;
          student?: Student | null;
          answers?: Answers;
          completedAt?: string | null;
        };
        if (saved.answers) setAnswers({ ...emptyAnswers(), ...saved.answers });
        if (saved.student) setStudent(saved.student);
        if (saved.step && saved.student) setStep(saved.step);
        if (saved.completedAt) setCompletedAt(saved.completedAt);
      }
    } catch {
      // تجاهل أي خطأ في القراءة
    }
    setMounted(true);
  }, []);

  // حفظ التقدم
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ step, student, answers, completedAt }),
      );
    } catch {
      // تجاهل
    }
  }, [mounted, step, student, answers, completedAt]);

  function handleStart(s: Student) {
    setStudent(s);
    setStep("quiz");
    window.scrollTo({ top: 0 });
  }

  function handleComplete() {
    // نسجّل لحظة إنهاء الاستبيان (تُعرض بتوقيت الكويت في التقرير)
    setCompletedAt(new Date().toISOString());
    setStep("results");
    window.scrollTo({ top: 0 });
  }

  function handleExit() {
    setStep("intro");
    window.scrollTo({ top: 0 });
  }

  function handleRestart() {
    setAnswers(emptyAnswers());
    setStudent(null);
    setCompletedAt(null);
    setStep("intro");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // تجاهل
    }
    window.scrollTo({ top: 0 });
  }

  // شاشة تحميل بسيطة لتفادي وميض المحتوى قبل استرجاع الحالة
  if (!mounted) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center text-[#e87a28]">
        <span className="text-sm font-medium">جارٍ التحميل…</span>
      </div>
    );
  }

  if (step === "quiz" && student) {
    return (
      <Questionnaire
        answers={answers}
        setAnswers={setAnswers}
        onComplete={handleComplete}
        onExit={handleExit}
      />
    );
  }

  if (step === "results" && student) {
    return (
      <ResultsScreen
        student={student}
        answers={answers}
        completedAt={completedAt}
        onRestart={handleRestart}
      />
    );
  }

  return <IntroScreen onStart={handleStart} />;
}
