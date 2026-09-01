import type { QuestionId } from "@/types/lead";

export interface QuizOption {
  value: string;
  label: string;
  /** Contribution to lead_score. Omitted = 0. Never shown to the user. */
  score?: number;
}

export interface QuizQuestion {
  id: QuestionId;
  title: string;
  options: QuizOption[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "for_whom",
    title: "Para quem você está buscando o tratamento?",
    options: [
      { value: "para_mim", label: "Para mim", score: 10 },
      { value: "filho", label: "Para meu filho(a)", score: 3 },
      { value: "conjuge", label: "Para meu marido/esposa", score: 5 },
      { value: "outra_pessoa", label: "Para outra pessoa", score: 0 },
    ],
  },
  {
    id: "concern",
    title: "O que mais incomoda você no seu sorriso hoje?",
    options: [
      { value: "dentes_desalinhados", label: "Dentes tortos ou desalinhados" },
      { value: "espacos", label: "Espaços entre os dentes" },
      { value: "mordida", label: "Mordida" },
      { value: "aparencia", label: "A aparência do meu sorriso" },
      { value: "nao_sei", label: "Não sei exatamente" },
    ],
  },
  {
    id: "awareness",
    title: "Você já considerou usar alinhadores invisíveis?",
    options: [
      { value: "procurando_clinica", label: "Sim, estou procurando uma clínica", score: 40 },
      { value: "pesquisando", label: "Sim, mas ainda estou pesquisando", score: 25 },
      { value: "ouviu_falar", label: "Já ouvi falar, mas nunca pesquisei", score: 10 },
      { value: "conhecendo_agora", label: "Estou conhecendo agora", score: 5 },
    ],
  },
  {
    id: "readiness",
    title: "Pensando em começar agora, como você se sente?",
    options: [
      {
        value: "pronto",
        label: "Pronto(a) para começar, é algo que eu realmente quero resolver",
        score: 35,
      },
      {
        value: "animado_duvidas",
        label: "Animado(a), mas quero entender melhor antes de decidir",
        score: 22,
      },
      {
        value: "nao_prioridade",
        label: "Interessado(a), mas não é uma prioridade agora",
        score: 10,
      },
      {
        value: "so_curiosidade",
        label: "Sinceramente, é mais curiosidade do que uma decisão real",
        score: 0,
      },
    ],
  },
  {
    id: "priority",
    title: "O que é mais importante para você em um tratamento ortodôntico?",
    options: [
      { value: "discricao", label: "Discrição" },
      { value: "estetica", label: "Estética do sorriso" },
      { value: "praticidade", label: "Praticidade no dia a dia" },
      { value: "conforto", label: "Conforto" },
      { value: "custo_beneficio", label: "Custo-benefício" },
    ],
  },
  {
    id: "timeline",
    title: "Quando você gostaria de começar?",
    options: [
      { value: "quanto_antes", label: "O quanto antes", score: 40 },
      { value: "30_dias", label: "Nos próximos 30 dias", score: 35 },
      { value: "3_meses", label: "Nos próximos 3 meses", score: 15 },
      { value: "avaliando", label: "Ainda estou avaliando", score: 5 },
    ],
  },
];

export const TOTAL_QUESTIONS = QUIZ_QUESTIONS.length;

export function getOptionLabel(questionId: QuestionId, value: string): string {
  const question = QUIZ_QUESTIONS.find((q) => q.id === questionId);
  return question?.options.find((o) => o.value === value)?.label ?? value;
}
