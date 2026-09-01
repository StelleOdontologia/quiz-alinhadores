/**
 * WhatsApp number is intentionally not hardcoded. Configure it via
 * NEXT_PUBLIC_WHATSAPP_NUMBER in .env.local (E.164 digits only, e.g. 5521999999999).
 */
export function getWhatsappNumber(): string {
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
}

export function buildWhatsappLink(name: string): string {
  const number = getWhatsappNumber();
  const firstName = name.trim().split(/\s+/)[0] || "";
  const message = firstName
    ? `Olá, fiz o quiz de alinhadores da Stelle. Meu nome é ${firstName} e gostaria de conversar sobre meu tratamento.`
    : "Olá, fiz o quiz sobre alinhadores invisíveis e gostaria de saber mais sobre meu tratamento.";

  const encodedMessage = encodeURIComponent(message);
  if (!number) {
    // No number configured yet — surface this loudly instead of linking nowhere.
    return `https://wa.me/?text=${encodedMessage}`;
  }
  return `https://wa.me/${number}?text=${encodedMessage}`;
}

/**
 * Leads type their WhatsApp without a country code (e.g. "21988887777").
 * Normalizes to E.164 (Brazil) so the clinic can click straight into a chat.
 */
export function buildLeadWhatsappLink(leadWhatsapp: string, leadName: string): string {
  const digits = leadWhatsapp.replace(/\D/g, "");
  const withCountryCode = digits.startsWith("55") ? digits : `55${digits}`;
  const firstName = leadName.trim().split(/\s+/)[0] || "";
  const message = `Olá${firstName ? ` ${firstName}` : ""}! Aqui é da Stelle Odontologia, vi que você fez nosso quiz sobre alinhadores invisíveis. Podemos conversar sobre o seu tratamento?`;
  return `https://wa.me/${withCountryCode}?text=${encodeURIComponent(message)}`;
}

export function buildLeadTelLink(leadWhatsapp: string): string {
  const digits = leadWhatsapp.replace(/\D/g, "");
  const withCountryCode = digits.startsWith("55") ? digits : `55${digits}`;
  return `tel:+${withCountryCode}`;
}
