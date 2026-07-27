import { INITIAL_PRODUCTS } from '../data/initialProducts';

const PRODUCTS_KEY = 'zoom_market_products_v1';
const EMAIL_CONFIG_KEY = 'zoom_market_email_config_v1';

// Load products from localStorage or fallback to initial dataset
export function getStoredProducts() {
  try {
    const data = localStorage.getItem(PRODUCTS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading products from localStorage:', e);
  }
  // Save initial products if none exist
  saveProducts(INITIAL_PRODUCTS);
  return INITIAL_PRODUCTS;
}

// Save products list to localStorage
export function saveProducts(products) {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Error saving products to localStorage:', e);
  }
}

// Reset products to default initial dataset
export function resetStoredProducts() {
  saveProducts(INITIAL_PRODUCTS);
  return INITIAL_PRODUCTS;
}

// Default EmailJS Configuration
export const DEFAULT_EMAIL_CONFIG = {
  serviceId: '', // e.g. 'service_zoom'
  templateId: '', // e.g. 'template_order'
  publicKey: '',  // EmailJS Public Key
  recipientEmail: 'marketdzzoom@gmail.com',
  storePhone: '0550000000', // Default store WhatsApp contact number
  formspreeEndpoint: '' // Alternative Formspree URL e.g. https://formspree.io/f/xyz
};

export function getStoredEmailConfig() {
  try {
    const data = localStorage.getItem(EMAIL_CONFIG_KEY);
    if (data) {
      return { ...DEFAULT_EMAIL_CONFIG, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error('Error reading email config from localStorage:', e);
  }
  return DEFAULT_EMAIL_CONFIG;
}

export function saveEmailConfig(config) {
  try {
    localStorage.setItem(EMAIL_CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving email config to localStorage:', e);
  }
}
