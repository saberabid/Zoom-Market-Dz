const ADMIN_PIN_KEY = 'zoom_market_admin_pin_v1';
const DEFAULT_PIN = '2026';

export function getStoredAdminPin() {
  try {
    const stored = localStorage.getItem(ADMIN_PIN_KEY);
    return stored || DEFAULT_PIN;
  } catch (e) {
    return DEFAULT_PIN;
  }
}

export function saveAdminPin(newPin) {
  try {
    localStorage.setItem(ADMIN_PIN_KEY, newPin);
  } catch (e) {
    console.error('Error saving admin PIN:', e);
  }
}

export function verifyAdminPin(enteredPin) {
  const currentPin = getStoredAdminPin();
  return enteredPin.trim() === currentPin.trim();
}
