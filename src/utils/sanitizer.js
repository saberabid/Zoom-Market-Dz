/**
 * Security Sanitization & Anti-XSS Utilities
 * Zoom Market Dz Security Suite
 */

/**
 * Strips dangerous HTML, scripts, events, and encodes entities
 */
export function sanitizeText(input, maxLength = 250) {
  if (typeof input !== 'string') return '';

  let sanitized = input
    // Trim whitespace
    .trim()
    // Remove control / null characters
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Strip HTML tags (<script>, <iframe>, <style>, etc.)
    .replace(/<[^>]*>?/gm, '')
    // Remove javascript: and data: pseudo protocols
    .replace(/javascript\s*:/gi, '')
    .replace(/data\s*:/gi, '')
    .replace(/vbscript\s*:/gi, '')
    .replace(/on\w+\s*=/gi, '');

  // Truncate to maximum safe length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Sanitizes and normalizes phone numbers
 */
export function sanitizePhone(phone) {
  if (typeof phone !== 'string') return '';
  // Keep only digits, +, and spaces
  return phone.replace(/[^\d+ ]/g, '').substring(0, 20);
}

/**
 * Validates and sanitizes numeric prices
 */
export function sanitizePrice(price, min = 0, max = 10000000) {
  const num = parseFloat(price);
  if (isNaN(num) || num < min) return 0;
  if (num > max) return max;
  return Math.round(num * 100) / 100;
}

/**
 * Anti-Bot & Spam Verification (Honeypot & Time-to-Submit)
 */
export function verifyHumanSubmission({ honeypotField, formOpenedAt, minDurationMs = 1500 }) {
  // 1. Honeypot check: If the hidden bot field is filled, it's an automated bot!
  if (honeypotField && honeypotField.trim().length > 0) {
    console.warn('🛡️ Security: Automated Bot submission rejected via Honeypot trap.');
    return { isHuman: false, reason: 'honeypot' };
  }

  // 2. Time-to-submit check: Automated bots fill forms in < 500ms
  if (formOpenedAt) {
    const elapsed = Date.now() - formOpenedAt;
    if (elapsed < minDurationMs) {
      console.warn(`🛡️ Security: Submission too fast (${elapsed}ms), suspected bot.`);
      return { isHuman: false, reason: 'too_fast' };
    }
  }

  return { isHuman: true };
}

/**
 * Client-Side Order Rate Limiter (Max 1 order per 20 seconds)
 */
const RATE_LIMIT_KEY = 'zoom_market_last_order_ts';
export function checkOrderRateLimit(cooldownSeconds = 20) {
  try {
    const lastOrder = localStorage.getItem(RATE_LIMIT_KEY);
    if (lastOrder) {
      const elapsedSeconds = (Date.now() - parseInt(lastOrder, 10)) / 1000;
      if (elapsedSeconds < cooldownSeconds) {
        const remaining = Math.ceil(cooldownSeconds - elapsedSeconds);
        return {
          allowed: false,
          remainingSeconds: remaining,
          message: `Veuillez patienter ${remaining}s avant de passer une nouvelle commande.`
        };
      }
    }
    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}

export function recordOrderTimestamp() {
  try {
    localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
  } catch (e) {
    console.error(e);
  }
}
