/**
 * Opaque Geographic & Threat Security Suite
 * Zoom Market Dz Zero-Knowledge Security Architecture
 */

const GEO_CACHE_KEY = 'zoom_market_geo_auth_cache_v2';

/**
 * Verifies if client is authorized without disclosing security criteria
 */
export async function verifyAdminGeoLocation() {
  if (
    typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ) {
    return { allowed: true };
  }

  // 1. Check Session Cache
  try {
    const cached = sessionStorage.getItem(GEO_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < 30 * 60 * 1000) {
        return parsed.result;
      }
    }
  } catch (e) {
    console.warn(e);
  }

  // 2. Primary Provider Check
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch('https://ipwho.is/', {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const countryCode = (data.country_code || '').toUpperCase();
      const security = data.security || {};
      const isVpn = Boolean(security.vpn || security.proxy || security.tor || security.hosting);

      if (countryCode !== 'DZ' || isVpn) {
        const result = {
          allowed: false,
          code: 'ERR_SEC_403',
          message: 'Accès non autorisé. (Code: 403-DENIED)'
        };
        cacheResult(result);
        return result;
      }

      const successResult = { allowed: true };
      cacheResult(successResult);
      return successResult;
    }
  } catch (err) {
    console.warn(err);
  }

  // 3. Fallback Provider Check
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch('https://ipapi.co/json/', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const countryCode = (data.country_code || '').toUpperCase();
      const org = (data.org || '').toLowerCase();
      const isDatacenter = org.includes('hosting') || org.includes('cloud') || org.includes('vpn') || org.includes('proxy');

      if (countryCode !== 'DZ' || isDatacenter) {
        const result = {
          allowed: false,
          code: 'ERR_SEC_403',
          message: 'Accès non autorisé. (Code: 403-DENIED)'
        };
        cacheResult(result);
        return result;
      }

      const successResult = { allowed: true };
      cacheResult(successResult);
      return successResult;
    }
  } catch (fallbackErr) {
    console.warn(fallbackErr);
  }

  // 4. Third-tier fallback
  try {
    const res = await fetch('https://api.country.is/');
    if (res.ok) {
      const data = await res.json();
      const countryCode = (data.country || '').toUpperCase();

      if (countryCode !== 'DZ') {
        const result = {
          allowed: false,
          code: 'ERR_SEC_403',
          message: 'Accès non autorisé. (Code: 403-DENIED)'
        };
        cacheResult(result);
        return result;
      }

      return { allowed: true };
    }
  } catch (e) {
    console.error(e);
  }

  return { allowed: true };
}

function cacheResult(result) {
  try {
    sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      result
    }));
  } catch (e) {
    console.error(e);
  }
}
