/**
 * Cryptographic Admin Authentication & Anti-Brute-Force Security Suite
 * Zoom Market Dz Security Architecture
 */

const ADMIN_PIN_HASH_KEY = 'zoom_market_admin_pin_hash_v2';
const FAILED_ATTEMPTS_KEY = 'zoom_market_auth_failures_v2';
const LOCKOUT_EXPIRY_KEY = 'zoom_market_auth_lockout_until_v2';

// Salt for hash generation
const AUTH_SALT = 'ZOOM_MARKET_DZ_SECURE_SALT_2026_!@#';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout

// Default PIN '2026' SHA-256 hash precomputed with AUTH_SALT
// echo -n "2026ZOOM_MARKET_DZ_SECURE_SALT_2026_!@#" | sha256sum
const DEFAULT_PIN_HASH = 'c3cf98e6a17b01d3cb4112e4f0dc2fec0a69a9b74caae5f63d043422ad4e0e56';

/**
 * Computes SHA-256 hash using Web Crypto API
 */
export async function hashPin(pin) {
  const salted = pin + AUTH_SALT;
  const encoder = new TextEncoder();
  const data = encoder.encode(salted);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Checks if authentication is currently locked due to too many failed attempts
 */
export function getLockoutStatus() {
  try {
    const lockoutUntil = localStorage.getItem(LOCKOUT_EXPIRY_KEY);
    if (lockoutUntil) {
      const remainingMs = parseInt(lockoutUntil, 10) - Date.now();
      if (remainingMs > 0) {
        return {
          isLocked: true,
          remainingSeconds: Math.ceil(remainingMs / 1000),
          remainingMinutes: Math.ceil(remainingMs / 60000)
        };
      } else {
        // Lockout expired, clean up
        localStorage.removeItem(LOCKOUT_EXPIRY_KEY);
        localStorage.removeItem(FAILED_ATTEMPTS_KEY);
      }
    }

    const failedCount = parseInt(localStorage.getItem(FAILED_ATTEMPTS_KEY) || '0', 10);
    return {
      isLocked: false,
      failedAttempts: failedCount,
      remainingAttempts: Math.max(0, MAX_ATTEMPTS - failedCount)
    };
  } catch {
    return { isLocked: false, failedAttempts: 0, remainingAttempts: MAX_ATTEMPTS };
  }
}

/**
 * Record a failed authentication attempt
 */
export function recordFailedAttempt() {
  try {
    const current = parseInt(localStorage.getItem(FAILED_ATTEMPTS_KEY) || '0', 10) + 1;
    localStorage.setItem(FAILED_ATTEMPTS_KEY, current.toString());

    if (current >= MAX_ATTEMPTS) {
      const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
      localStorage.setItem(LOCKOUT_EXPIRY_KEY, lockoutUntil.toString());
      return { isLocked: true, remainingMinutes: 15 };
    }

    return { isLocked: false, remainingAttempts: MAX_ATTEMPTS - current };
  } catch {
    return { isLocked: false, remainingAttempts: MAX_ATTEMPTS };
  }
}

/**
 * Reset failed attempts upon successful login
 */
export function resetFailedAttempts() {
  try {
    localStorage.removeItem(FAILED_ATTEMPTS_KEY);
    localStorage.removeItem(LOCKOUT_EXPIRY_KEY);
  } catch (e) {
    console.error(e);
  }
}

/**
 * Cryptographic PIN Verification
 */
export async function verifyAdminPin(enteredPin) {
  // Check lockout first
  const lockout = getLockoutStatus();
  if (lockout.isLocked) {
    return {
      success: false,
      isLocked: true,
      remainingSeconds: lockout.remainingSeconds,
      remainingMinutes: lockout.remainingMinutes,
      message: `Accès temporairement bloqué pour des raisons de sécurité. Réessayez dans ${lockout.remainingMinutes} minutes.`
    };
  }

  const enteredHash = await hashPin(enteredPin.trim());
  const storedHash = localStorage.getItem(ADMIN_PIN_HASH_KEY) || DEFAULT_PIN_HASH;

  // Verify hash
  if (enteredHash === storedHash) {
    resetFailedAttempts();
    return { success: true };
  } else {
    const failStatus = recordFailedAttempt();
    if (failStatus.isLocked) {
      return {
        success: false,
        isLocked: true,
        remainingMinutes: 15,
        message: 'Trop de tentatives erronées. Accès bloqué pendant 15 minutes.'
      };
    }
    return {
      success: false,
      isLocked: false,
      remainingAttempts: failStatus.remainingAttempts,
      message: `Code PIN incorrect. (${failStatus.remainingAttempts} tentative(s) restante(s))`
    };
  }
}

/**
 * Securely change the admin PIN (stores SHA-256 hash)
 */
export async function changeAdminPin(newPin) {
  if (!newPin || newPin.trim().length < 4) {
    throw new Error('Le code PIN doit comporter au moins 4 caractères.');
  }
  const newHash = await hashPin(newPin.trim());
  localStorage.setItem(ADMIN_PIN_HASH_KEY, newHash);
  resetFailedAttempts();
}
