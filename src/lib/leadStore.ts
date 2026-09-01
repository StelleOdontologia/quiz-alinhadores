import { createClient } from "@supabase/supabase-js";
import type { StoredLead } from "@/types/lead";

/**
 * Server-only client using the service_role key, which bypasses RLS.
 * Never import this file from client components — it must only run in
 * Server Components, Route Handlers, or Server Actions.
 */
function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY não configurados. Veja .env.local.example."
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

interface LeadRow {
  id: string;
  name: string;
  whatsapp: string;
  email: string | null;
  answers: StoredLead["answers"];
  utm: StoredLead["utm"];
  meta: StoredLead["meta"];
  page_url: string | null;
  lead_score: number;
  classification: StoredLead["classification"];
  created_at: string;
}

function rowToLead(row: LeadRow): StoredLead {
  return {
    id: row.id,
    name: row.name,
    whatsapp: row.whatsapp,
    email: row.email ?? undefined,
    answers: row.answers,
    utm: row.utm,
    meta: row.meta,
    pageUrl: row.page_url ?? undefined,
    consent: true,
    leadScore: row.lead_score,
    classification: row.classification,
    createdAt: row.created_at,
  };
}

export async function saveLead(lead: StoredLead): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("leads").insert({
    id: lead.id,
    name: lead.name,
    whatsapp: lead.whatsapp,
    email: lead.email ?? null,
    answers: lead.answers,
    utm: lead.utm,
    meta: lead.meta,
    page_url: lead.pageUrl ?? null,
    lead_score: lead.leadScore,
    classification: lead.classification,
    created_at: lead.createdAt,
  });

  if (error) {
    throw new Error(`Falha ao salvar lead no Supabase: ${error.message}`);
  }
}

export async function listLeads(): Promise<StoredLead[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Falha ao listar leads do Supabase: ${error.message}`);
  }

  return (data as LeadRow[]).map(rowToLead);
}
