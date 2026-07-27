// Format price into DZD / DA standard format (e.g., 5 800 DA)
export function formatPrice(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '0 DA';
  const formatted = new Intl.NumberFormat('fr-DZ', {
    maximumFractionDigits: 0
  }).format(amount);
  return `${formatted} DA`;
}

// Validate Algerian phone number (must start with 05, 06, or 07 and contain exactly 10 digits)
export function validateDZPhone(phone) {
  if (!phone) return false;
  // Remove spaces, dots, dashes
  const cleanPhone = phone.replace(/[\s\.\-\(\)]/g, '');
  // Match 05xxxxxxxx, 06xxxxxxxx, 07xxxxxxxx or +213 5/6/7xxxxxxxx
  const regex = /^(0|\+?213)[567]\d{8}$/;
  return regex.test(cleanPhone);
}

// Clean phone for WhatsApp (+213...)
export function formatPhoneForWhatsApp(phone) {
  if (!phone) return '213000000000';
  let clean = phone.replace(/[\s\.\-\(\)]/g, '');
  if (clean.startsWith('0')) {
    clean = '213' + clean.substring(1);
  } else if (clean.startsWith('+')) {
    clean = clean.substring(1);
  }
  return clean;
}
