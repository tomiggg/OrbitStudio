export function buildWhatsAppLink(phoneE164: string, message: string) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${phoneE164}?text=${text}`;
}