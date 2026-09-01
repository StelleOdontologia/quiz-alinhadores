import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated, logout } from "@/app/admin/actions";
import { listLeads } from "@/lib/leadStore";
import { getOptionLabel } from "@/lib/quizConfig";
import { buildLeadTelLink, buildLeadWhatsappLink } from "@/lib/whatsapp";
import { Logo } from "@/components/Logo";
import type { LeadClassification } from "@/types/lead";

const STATUS_STYLES: Record<LeadClassification, string> = {
  HOT: "bg-red-50 text-red-700 border-red-200",
  WARM: "bg-amber-50 text-amber-700 border-amber-200",
  COLD: "bg-slate-100 text-slate-600 border-slate-200",
};

const STATUS_LABELS: Record<LeadClassification, string> = {
  HOT: "🔥 Quente",
  WARM: "🌤️ Morno",
  COLD: "❄️ Frio",
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect("/admin/login");

  const { status } = await searchParams;
  const allLeads = (await listLeads()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const filter = status && ["HOT", "WARM", "COLD"].includes(status) ? (status as LeadClassification) : undefined;
  const leads = filter ? allLeads.filter((l) => l.classification === filter) : allLeads;

  const counts = {
    HOT: allLeads.filter((l) => l.classification === "HOT").length,
    WARM: allLeads.filter((l) => l.classification === "WARM").length,
    COLD: allLeads.filter((l) => l.classification === "COLD").length,
  };

  return (
    <main className="mx-auto min-h-dvh w-full max-w-5xl px-4 py-8 sm:px-8">
      <div className="mb-8 flex items-center justify-between">
        <Logo height={26} />
        <form action={logout}>
          <button type="submit" className="text-sm text-stelle-muted underline">
            Sair
          </button>
        </form>
      </div>

      <h1 className="mb-1 text-2xl font-semibold text-stelle-ink">Leads do quiz</h1>
      <p className="mb-6 text-sm text-stelle-muted">
        {allLeads.length} lead{allLeads.length === 1 ? "" : "s"} no total
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        <FilterTab href="/admin" active={!filter} label={`Todos (${allLeads.length})`} />
        <FilterTab href="/admin?status=HOT" active={filter === "HOT"} label={`🔥 Quente (${counts.HOT})`} />
        <FilterTab href="/admin?status=WARM" active={filter === "WARM"} label={`🌤️ Morno (${counts.WARM})`} />
        <FilterTab href="/admin?status=COLD" active={filter === "COLD"} label={`❄️ Frio (${counts.COLD})`} />
      </div>

      {leads.length === 0 ? (
        <p className="rounded-xl border border-stelle-border bg-stelle-surface px-6 py-10 text-center text-stelle-muted">
          Nenhum lead por aqui ainda.
        </p>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="rounded-2xl border border-stelle-border bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-lg font-semibold text-stelle-ink">{lead.name}</p>
                  <p className="text-sm text-stelle-muted">{formatDate(lead.createdAt)}</p>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-sm font-medium ${STATUS_STYLES[lead.classification]}`}
                >
                  {STATUS_LABELS[lead.classification]} · {lead.leadScore} pts
                </span>
              </div>

              <div className="mb-4 flex flex-wrap gap-1.5 text-sm">
                <Tag>{getOptionLabel("for_whom", lead.answers.for_whom)}</Tag>
                <Tag>{getOptionLabel("concern", lead.answers.concern)}</Tag>
                <Tag>{getOptionLabel("awareness", lead.answers.awareness)}</Tag>
                {lead.answers.readiness && <Tag>{getOptionLabel("readiness", lead.answers.readiness)}</Tag>}
                <Tag>{getOptionLabel("priority", lead.answers.priority)}</Tag>
                <Tag>{getOptionLabel("timeline", lead.answers.timeline)}</Tag>
              </div>

              {(lead.utm.utm_campaign || lead.utm.utm_source) && (
                <p className="mb-4 text-xs text-stelle-muted">
                  Origem: {[lead.utm.utm_source, lead.utm.utm_medium, lead.utm.utm_campaign, lead.utm.utm_content]
                    .filter(Boolean)
                    .join(" / ")}
                </p>
              )}

              <div className="flex flex-wrap gap-3 text-sm">
                <a
                  href={buildLeadWhatsappLink(lead.whatsapp, lead.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-stelle-primary px-4 py-2 font-medium text-white transition-colors hover:bg-stelle-primary-dark"
                >
                  Falar no WhatsApp
                </a>
                <a
                  href={buildLeadTelLink(lead.whatsapp)}
                  className="rounded-full border border-stelle-border px-4 py-2 font-medium text-stelle-ink transition-colors hover:bg-stelle-surface"
                >
                  Ligar
                </a>
                {lead.email && (
                  <a
                    href={`mailto:${lead.email}`}
                    className="rounded-full border border-stelle-border px-4 py-2 font-medium text-stelle-ink transition-colors hover:bg-stelle-surface"
                  >
                    {lead.email}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

function FilterTab({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-stelle-primary bg-stelle-primary-light text-stelle-primary-dark"
          : "border-stelle-border bg-white text-stelle-muted hover:bg-stelle-surface"
      }`}
    >
      {label}
    </Link>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-stelle-surface px-3 py-1 text-stelle-ink">{children}</span>
  );
}
