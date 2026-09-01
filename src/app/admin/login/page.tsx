import { login } from "@/app/admin/actions";
import { Logo } from "@/components/Logo";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center px-6 py-10">
      <div className="mb-8 flex justify-center">
        <Logo height={28} />
      </div>

      <h1 className="mb-6 text-center text-xl font-semibold text-stelle-ink">
        Painel de leads
      </h1>

      <form action={login} className="space-y-4">
        <input
          type="password"
          name="password"
          placeholder="Senha de acesso"
          autoFocus
          className="w-full rounded-xl border border-stelle-border bg-white px-4 py-3.5 text-base text-stelle-ink outline-none transition-colors focus:border-stelle-primary"
        />
        {error && (
          <p className="text-sm text-red-600">Senha incorreta. Tente novamente.</p>
        )}
        <button
          type="submit"
          className="w-full rounded-full bg-stelle-primary px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-stelle-primary-dark"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}
