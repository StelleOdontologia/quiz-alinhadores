export type QuestionId =
  | "for_whom"
  | "concern"
  | "awareness"
  | "readiness"
  | "priority"
  | "timeline";

export interface QuizAnswers {
  for_whom: string;
  concern: string;
  awareness: string;
  readiness: string;
  priority: string;
  timeline: string;
}

export type LeadClassification = "HOT" | "WARM" | "COLD";

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

export interface MetaAdParams {
  fbclid?: string;
  campaign_id?: string;
  adset_id?: string;
  ad_id?: string;
}

export interface LeadPayload {
  name: string;
  whatsapp: string;
  email?: string;
  answers: QuizAnswers;
  utm: UtmParams;
  meta: MetaAdParams;
  pageUrl?: string;
  consent: boolean;
}

export interface StoredLead extends LeadPayload {
  id: string;
  leadScore: number;
  classification: LeadClassification;
  createdAt: string;
}
