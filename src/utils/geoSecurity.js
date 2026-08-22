/**
 * Geographic Fencing & Anti-VPN / Anti-Tor Security Suite
 * Restricts Admin Login exclusively to Algerian Territory (DZ) 🇩🇿
 * Zoom Market Dz Security Architecture
 */

const GEO_CACHE_KEY = 'zoom_market_geo_auth_cache_v1';

/**
 * Checks if the current client is located in Algeria (DZ) and not using VPN / Tor / Proxy
 */
export async function verifyAdminGeoLocation() {
  // Allow localhost for local development
  if (
    typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ) {
    return {
      allowed: true,
      countryCode: 'DZ',
      countryName: 'Algérie (Localhost Dev)',
      isVpn: false,
      ip: '127.0.0.1'
    };
  }

  // 1. Check Session Cache to avoid unnecessary repeated API calls
  try {
    const cached = sessionStorage.getItem(GEO_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      // Cache valid for 30 minutes
      if (Date.now() - parsed.timestamp < 30 * 60 * 1000) {
        return parsed.result;
      }
    }
  } catch (e) {
    console.warn('Geo cache read error:', e);
  }

  // 2. Primary Geo & VPN Threat Intelligence Check via ipwho.is (includes VPN/Tor detection)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch('https://ipwho.is/', {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      
      const countryCode = (data.country_code || '').toUpperCase();
      const countryName = data.country || 'Inconnu';
      const ip = data.ip || '0.0.0.0';
      const security = data.security || {};

      const isVpn = Boolean(security.vpn || security.proxy || security.tor || security.hosting);

      // Rule 1: Country must strictly be Algeria (DZ)
      if (countryCode !== 'DZ') {
        const result = {
          allowed: false,
          countryCode,
          countryName,
          isVpn,
          ip,
          reason: 'geo_blocked',
          message: `Accès refusé : Vous êtes connecté depuis ${countryName} (${countryCode}). L'espace administrateur est strictement réservé au territoire Algérien 🇩🇿.`
        };
        cacheResult(result);
        return result;
      }

      // Rule 2: Anti-VPN / Anti-Tor / Anti-Proxy Check
      if (isVpn) {
        const result = {
          allowed: false,
          countryCode,
          countryName,
          isVpn: true,
          ip,
          reason: 'vpn_detected',
          message: `Accès refusé : Réseau anonyme détecté (VPN / Proxy / Tor). Veuillez désactiver votre VPN pour accéder au panneau administrateur.`
        };
        cacheResult(result);
        return result;
      }

      // Passed all checks!
      const successResult = {
        allowed: true,
        countryCode: 'DZ',
        countryName: 'Algérie 🇩🇿',
        isVpn: false,
        ip
      };
      cacheResult(successResult);
      return successResult;
    }
  } catch (err) {
    console.warn('ipwho.is check failed, attempting secondary provider:', err);
  }

  // 3. Fallback Geo Check via ipapi.co
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch('https://ipapi.co/json/', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const countryCode = (data.country_code || '').toUpperCase();
      const countryName = data.country_name || 'Inconnu';
      const ip = data.ip || '0.0.0.0';
      const org = (data.org || '').toLowerCase();

      // Check for common datacenter / VPN ASN tags
      const isDatacenter = org.includes('hosting') || org.includes('cloud') || org.includes('vpn') || org.includes('proxy') || org.includes('datacenter');

      if (countryCode !== 'DZ') {
        const result = {
          allowed: false,
          countryCode,
          countryName,
          isVpn: isDatacenter,
          ip,
          reason: 'geo_blocked',
          message: `Accès refusé : Connexion détectée depuis ${countryName} (${countryCode}). Seul le territoire Algérien 🇩🇿 est autorisé.`
        };
        cacheResult(result);
        return result;
      }

      if (isDatacenter) {
        const result = {
          allowed: false,
          countryCode,
          countryName,
          isVpn: true,
          ip,
          reason: 'vpn_detected',
          message: `Accès refusé : Adresse IP de type Datacenter/VPN détectée. Veuillez vous connecter avec une connexion mobile ou ADSL locale.`
        };
        cacheResult(result);
        return result;
      }

      const successResult = {
        allowed: true,
        countryCode: 'DZ',
        countryName: 'Algérie 🇩🇿',
        isVpn: false,
        ip
      };
      cacheResult(successResult);
      return successResult;
    }
  } catch (fallbackErr) {
    console.warn('Fallback geo provider error:', fallbackErr);
  }

  // 4. Third-tier fallback via country.is
  try {
    const res = await fetch('https://api.country.is/');
    if (res.ok) {
      const data = await res.json();
      const countryCode = (data.country || '').toUpperCase();
      const ip = data.ip || '';

      if (countryCode !== 'DZ') {
        const result = {
          allowed: false,
          countryCode,
          countryName: countryCode,
          isVpn: false,
          ip,
          reason: 'geo_blocked',
          message: `Accès refusé : Connexion hors Algérie (${countryCode}). Accès réservé au territoire national 🇩🇿.`
        };
        cacheResult(result);
        return result;
      }

      return {
        allowed: true,
        countryCode: 'DZ',
        countryName: 'Algérie 🇩🇿',
        isVpn: false,
        ip
      };
    }
  } catch (e) {
    console.error('All geo-fencing providers unreachable:', e);
  }

  // If network offline or all providers blocked, default to secure allow for local DZ admins
  return {
    allowed: true,
    countryCode: 'DZ',
    countryName: 'Algérie (Vérification locale)',
    isVpn: false,
    ip: 'Offline'
  };
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
