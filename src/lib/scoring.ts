import { QUIZ_QUESTIONS } from "@/lib/quizConfig";
import type { LeadClassification, QuizAnswers } from "@/types/lead";

const MAX_SCORE = QUIZ_QUESTIONS.reduce(
  (sum, q) => sum + Math.max(...q.options.map((o) => o.score ?? 0)),
  0
);

export function computeLeadScore(answers: QuizAnswers): number {
  let score = 0;
  for (const question of QUIZ_QUESTIONS) {
    const chosenValue = answers[question.id];
    const option = question.options.find((o) => o.value === chosenValue);
    score += option?.score ?? 0;
  }
  return score;
}

/**
 * The "readiness" answer is a direct self-assessment of priority/commitment,
 * not just another point in a weighted sum — someone who admits it's "só
 * curiosidade" shouldn't outrank a genuinely committed lead just because
 * they answered well elsewhere. So it acts as a ceiling on the classification
 * on top of the overall score ratio.
 */
export function classifyLead(score: number, answers: QuizAnswers): LeadClassification {
  const ratio = score / MAX_SCORE;

  if (answers.readiness === "so_curiosidade") return "COLD";

  if (answers.readiness === "nao_prioridade") {
    return ratio >= 0.38 ? "WARM" : "COLD";
  }

  if (ratio >= 0.78) return "HOT";
  if (ratio >= 0.38) return "WARM";
  return "COLD";
}
