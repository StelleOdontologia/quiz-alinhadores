import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { QUIZ_QUESTIONS } from "@/lib/quizConfig";
import { classifyLead, computeLeadScore } from "@/lib/scoring";
import { saveLead } from "@/lib/leadStore";
import type { LeadPayload, QuizAnswers, StoredLead } from "@/types/lead";

const WHATSAPP_REGEX = /^\+?\d{10,15}$/;

function isValidAnswers(answers: unknown): answers is QuizAnswers {
  if (!answers || typeof answers !== "object") return false;
  return QUIZ_QUESTIONS.every((q) => {
    const value = (answers as Record<string, unknown>)[q.id];
    return typeof value === "string" && q.options.some((o) => o.value === value);
  });
}

export async function POST(request: NextRequest) {
  let body: LeadPayload & { hp?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field. Pretend success.
  if (body.hp) {
    return NextResponse.json({ success: true });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const whatsapp = typeof body.whatsapp === "string" ? body.whatsapp.replace(/\D/g, "") : "";
  const email = typeof body.email === "string" ? body.email.trim() : undefined;

  if (name.length < 2) {
    return NextResponse.json({ error: "Nome inválido." }, { status: 400 });
  }
  if (!WHATSAPP_REGEX.test(whatsapp)) {
    return NextResponse.json({ error: "WhatsApp inválido." }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
  }
  if (!isValidAnswers(body.answers)) {
    return NextResponse.json({ error: "Respostas do quiz incompletas." }, { status: 400 });
  }
  if (body.consent !== true) {
    return NextResponse.json({ error: "É necessário aceitar o uso dos dados." }, { status: 400 });
  }

  const leadScore = computeLeadScore(body.answers);
  const classification = classifyLead(leadScore, body.answers);

  const lead: StoredLead = {
    id: randomUUID(),
    name,
    whatsapp,
    email: email || undefined,
    answers: body.answers,
    utm: body.utm || {},
    meta: body.meta || {},
    pageUrl: body.pageUrl,
    consent: true,
    leadScore,
    classification,
    createdAt: new Date().toISOString(),
  };

  await saveLead(lead);

  return NextResponse.json({ success: true });
}
