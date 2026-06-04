/**
 * Format a date string or Date object to a localized date string
 * @param date - ISO date string or Date object
 * @param locale - Locale code (default: 'es-MX')
 * @returns Formatted date string
 */
export function formatDate(date: string | Date, locale: string = 'es-MX'): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';
    
    return dateObj.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

/**
 * Format a date to a short localized format (e.g., "03 Jun 2026")
 * @param date - ISO date string or Date object
 * @param locale - Locale code (default: 'es-MX')
 * @returns Formatted date string
 */
export function formatDateShort(date: string | Date, locale: string = 'es-MX'): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';
    
    return dateObj.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

/**
 * Format a date and time to a localized format
 * @param date - ISO date string or Date object
 * @param locale - Locale code (default: 'es-MX')
 * @returns Formatted date and time string
 */
export function formatDateTime(date: string | Date, locale: string = 'es-MX'): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';
    
    return dateObj.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

/**
 * Format a price to a localized currency format
 * @param price - Price number
 * @param currency - Currency code (default: 'MXN')
 * @param locale - Locale code (default: 'es-MX')
 * @returns Formatted price string
 */
export function formatCurrency(price: number, currency: string = 'MXN', locale: string = 'es-MX'): string {
  try {
    return price.toLocaleString(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  } catch {
    return `$${price}`;
  }
}

// Alias for backward compatibility
export const formatPrice = formatCurrency;

/**
 * Calculate and format the time until a given date (e.g., "En 3 días")
 * @param date - ISO date string or Date object
 * @param locale - Locale code (default: 'es-MX')
 * @returns Relative time string
 */
export function formatTimeUntil(date: string | Date, locale: string = 'es-MX'): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';
    
    const now = new Date();
    const diffMs = dateObj.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return locale.startsWith('es') ? 'Finalizado' : 'Finished';
    } else if (diffDays === 0) {
      return locale.startsWith('es') ? 'Hoy' : 'Today';
    } else if (diffDays === 1) {
      return locale.startsWith('es') ? 'Mañana' : 'Tomorrow';
    } else if (diffDays <= 7) {
      return locale.startsWith('es') ? `En ${diffDays} días` : `In ${diffDays} days`;
    } else {
      return formatDateShort(dateObj, locale);
    }
  } catch {
    return '';
  }
}
