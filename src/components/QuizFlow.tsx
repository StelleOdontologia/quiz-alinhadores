"use client";

import { useEffect, useRef, useState } from "react";
import { QUIZ_QUESTIONS, TOTAL_QUESTIONS } from "@/lib/quizConfig";
import { getAttribution, trackEvent } from "@/lib/tracking";
import { buildWhatsappLink } from "@/lib/whatsapp";
import { ProgressBar } from "@/components/ProgressBar";
import { OptionButton } from "@/components/OptionButton";
import { LeadForm, LeadFormValues } from "@/components/LeadForm";
import { Logo } from "@/components/Logo";
import type { QuizAnswers } from "@/types/lead";

type Step = "question" | "transition" | "form" | "result";

const EMPTY_ANSWERS: Partial<QuizAnswers> = {};

export function QuizFlow() {
  const [step, setStep] = useState<Step>("question");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>(EMPTY_ANSWERS);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [leadName, setLeadName] = useState("");
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackEvent("QuizStart");
  }, []);

  const question = QUIZ_QUESTIONS[questionIndex];

  function handleSelect(value: string) {
    const updated = { ...answers, [question.id]: value };
    setAnswers(updated);
    trackEvent("QuizQuestionAnswered", { question_number: questionIndex + 1 });

    window.setTimeout(() => {
      if (questionIndex + 1 < TOTAL_QUESTIONS) {
        setQuestionIndex((i) => i + 1);
      } else {
        setStep("transition");
      }
    }, 220);
  }

  async function handleFormSubmit(values: LeadFormValues) {
    setSubmitting(true);
    setSubmitError(null);
    const attribution = getAttribution();

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          whatsapp: values.whatsapp,
          email: values.email || undefined,
          consent: true,
          answers,
          pageUrl: window.location.href,
          utm: {
            utm_source: attribution.utm_source,
            utm_medium: attribution.utm_medium,
            utm_campaign: attribution.utm_campaign,
            utm_content: attribution.utm_content,
            utm_term: attribution.utm_term,
          },
          meta: {
            fbclid: attribution.fbclid,
            campaign_id: attribution.campaign_id,
            adset_id: attribution.adset_id,
            ad_id: attribution.ad_id,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Não foi possível enviar. Tente novamente.");
      }

      trackEvent("Lead");
      setLeadName(values.name);
      setStep("result");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erro inesperado. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleWhatsappClick() {
    trackEvent("Contact");
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 py-6 sm:py-10">
      <div className="mb-6 flex justify-center sm:mb-10">
        <Logo height={28} />
      </div>

      {step === "question" && (
        <div key={questionIndex} className="flex flex-1 flex-col animate-fade-slide-in">
          <ProgressBar current={questionIndex + 1} total={TOTAL_QUESTIONS} />
          <h1 className="mt-8 mb-8 text-2xl font-semibold leading-snug text-stelle-ink sm:text-3xl">
            {question.title}
          </h1>
          <div className="flex flex-col gap-3">
            {question.options.map((option) => (
              <OptionButton
                key={option.value}
                label={option.label}
                selected={answers[question.id] === option.value}
                onClick={() => handleSelect(option.value)}
              />
            ))}
          </div>
        </div>
      )}

      {step === "transition" && (
        <TransitionScreen onContinue={() => setStep("form")} />
      )}

      {step === "form" && (
        <div className="flex flex-1 flex-col justify-center animate-fade-slide-in">
          <h1 className="mb-2 text-2xl font-semibold text-stelle-ink sm:text-3xl">
            Últimos detalhes
          </h1>
          <p className="mb-8 text-stelle-muted">
            Com essas informações, a equipe da Stelle entra em contato com você.
          </p>
          <LeadForm onSubmit={handleFormSubmit} submitting={submitting} error={submitError} />
        </div>
      )}

      {step === "result" && (
        <ResultScreen name={leadName} onWhatsappClick={handleWhatsappClick} />
      )}
    </div>
  );
}

function TransitionScreen({ onContinue }: { onContinue: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onContinue, 1400);
    return () => window.clearTimeout(t);
  }, [onContinue]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center animate-fade-slide-in">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-stelle-primary-light">
        <svg
          className="h-7 w-7 text-stelle-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="mb-2 text-xl font-semibold text-stelle-ink">Obrigado por responder.</h2>
      <p className="text-stelle-muted">
        Com base nas suas respostas, podemos entender melhor o que você está buscando. O
        próximo passo é conversar com a equipe da Stelle para entender as possibilidades para
        o seu caso.
      </p>
    </div>
  );
}

function ResultScreen({
  name,
  onWhatsappClick,
}: {
  name: string;
  onWhatsappClick: () => void;
}) {
  const firstName = name.trim().split(/\s+/)[0];
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center animate-fade-slide-in">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-stelle-primary-light">
        <svg
          className="h-7 w-7 text-stelle-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </div>
      <h1 className="mb-3 text-2xl font-semibold text-stelle-ink sm:text-3xl">
        {firstName ? `${firstName}, seu perfil mostra interesse` : "Seu perfil mostra interesse"}{" "}
        em transformar seu sorriso.
      </h1>
      <p className="mb-8 text-stelle-muted">
        Agora podemos dar o próximo passo: conversar com a equipe da Stelle e entender as
        possibilidades de tratamento para o seu caso.
      </p>
      <a
        href={buildWhatsappLink(name)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onWhatsappClick}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-stelle-primary px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-stelle-primary-dark"
      >
        Falar com a Stelle pelo WhatsApp
      </a>
    </div>
  );
}
