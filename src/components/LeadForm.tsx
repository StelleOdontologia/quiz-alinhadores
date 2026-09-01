"use client";

import { useState, FormEvent } from "react";

export interface LeadFormValues {
  name: string;
  whatsapp: string;
  email: string;
}

export function LeadForm({
  onSubmit,
  submitting,
  error,
}: {
  onSubmit: (values: LeadFormValues) => void;
  submitting: boolean;
  error: string | null;
}) {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  const nameValid = name.trim().length >= 2;
  const whatsappValid = whatsapp.replace(/\D/g, "").length >= 10;
  const canSubmit = nameValid && whatsappValid && !submitting;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;
    onSubmit({ name: name.trim(), whatsapp, email: email.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5" noValidate>
      {/* Honeypot field: hidden from real users, bots tend to fill every input. */}
      <input
        type="text"
        name="hp"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-stelle-ink">
          Como podemos chamar você?
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
          className="w-full rounded-xl border border-stelle-border bg-white px-4 py-3.5 text-base text-stelle-ink outline-none transition-colors focus:border-stelle-primary"
        />
        {touched && !nameValid && (
          <p className="mt-1 text-sm text-red-600">Digite seu nome.</p>
        )}
      </div>

      <div>
        <label htmlFor="whatsapp" className="mb-1.5 block text-sm font-medium text-stelle-ink">
          Qual seu WhatsApp?
        </label>
        <input
          id="whatsapp"
          type="tel"
          inputMode="numeric"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="(21) 90000-0000"
          className="w-full rounded-xl border border-stelle-border bg-white px-4 py-3.5 text-base text-stelle-ink outline-none transition-colors focus:border-stelle-primary"
        />
        {touched && !whatsappValid && (
          <p className="mt-1 text-sm text-red-600">Digite um WhatsApp válido com DDD.</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-stelle-ink">
          E-mail <span className="font-normal text-stelle-muted">(opcional)</span>
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          className="w-full rounded-xl border border-stelle-border bg-white px-4 py-3.5 text-base text-stelle-ink outline-none transition-colors focus:border-stelle-primary"
        />
      </div>

      <p className="text-xs text-stelle-muted">
        Seus dados serão utilizados apenas para entrar em contato sobre sua solicitação. Veja
        nossa{" "}
        <a href="/politica-de-privacidade" target="_blank" className="underline">
          Política de Privacidade
        </a>
        .
      </p>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-stelle-primary px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-stelle-primary-dark disabled:opacity-60"
      >
        {submitting ? "Enviando..." : "Quero falar com a Stelle"}
      </button>
    </form>
  );
}
