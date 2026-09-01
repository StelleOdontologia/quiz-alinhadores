import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <div className="mb-10">
        <Logo height={28} />
      </div>

      <h1 className="mb-6 text-2xl font-semibold text-stelle-ink">Política de Privacidade</h1>

      <p className="mb-4 text-stelle-muted">
        Conteúdo provisório — substitua por um texto revisado juridicamente antes de publicar
        a página em produção.
      </p>

      <div className="space-y-4 text-stelle-ink">
        <p>
          A Stelle Odontologia coleta as informações fornecidas neste formulário (nome,
          WhatsApp e, quando informado, e-mail) exclusivamente para entrar em contato sobre a
          sua solicitação de avaliação para tratamento com alinhadores invisíveis.
        </p>
        <p>
          Suas respostas ao questionário são usadas apenas para nos ajudar a entender melhor o
          seu interesse e preparar o atendimento — elas não constituem diagnóstico nem
          indicação de tratamento, que só pode ser definida por um ortodontista após avaliação
          presencial.
        </p>
        <p>
          Seus dados não são vendidos ou compartilhados com terceiros para fins de marketing.
          Você pode solicitar a exclusão dos seus dados a qualquer momento entrando em contato
          com a clínica.
        </p>
      </div>

      <Link href="/" className="mt-10 inline-block text-stelle-primary underline">
        Voltar
      </Link>
    </main>
  );
}
