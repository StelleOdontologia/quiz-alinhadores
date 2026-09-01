"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { trackEvent } from "@/lib/tracking";

export default function Home() {
  useEffect(() => {
    trackEvent("ViewContent");
  }, []);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 py-10 sm:py-16">
      <div className="mb-12 flex justify-center sm:mb-16">
        <Logo height={32} />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <h1 className="mb-4 text-3xl font-semibold leading-tight text-stelle-ink sm:text-4xl">
          Será que os alinhadores invisíveis são para você?
        </h1>
        <p className="mb-10 text-lg text-stelle-muted">
          Responda algumas perguntas rápidas e descubra qual pode ser o próximo passo para
          transformar o seu sorriso.
        </p>

        <Link
          href="/quiz"
          className="w-full rounded-full bg-stelle-primary px-6 py-4 text-base font-semibold text-white shadow-sm transition-colors hover:bg-stelle-primary-dark"
        >
          Começar avaliação
        </Link>
        <p className="mt-4 text-sm text-stelle-muted">Leva menos de 1 minuto.</p>
      </div>

      <p className="mt-10 text-center text-xs text-stelle-muted">
        Stelle Odontologia · Taquara, Rio de Janeiro
      </p>
    </main>
  );
}
