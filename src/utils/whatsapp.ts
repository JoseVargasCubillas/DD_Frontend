export const WHATSAPP_PHONE = "5214427475869";
export const WHATSAPP_DEFAULT_MESSAGE =
  "Hola Diego estoy navegando tu sitio web y tengo una duda";

/**
 * Construye un enlace a WhatsApp Web/App usando el número y mensaje
 * corporativos por defecto. Se puede sobreescribir el mensaje para
 * flujos concretos (ventas, lista de espera, prensa, etc.) manteniendo
 * el mismo número.
 */
export const waLink = (message: string = WHATSAPP_DEFAULT_MESSAGE): string =>
  `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
