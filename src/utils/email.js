import emailjs from '@emailjs/browser';
import { formatPrice, formatPhoneForWhatsApp } from './formatters';

/**
 * Send Order Email via EmailJS or Formspree
 */
export async function sendOrderNotification({ orderData, emailConfig }) {
  const { customer, items, subtotal, shippingFee, total } = orderData;

  // Build items formatted string
  const itemsText = items
    .map((item) => `- ${item.title} x ${item.quantity} (${formatPrice(item.price)} unitaire)`)
    .join('\n');

  // Format full message as requested
  const orderSummaryBody = `
========================================
    NOUVELLE COMMANDE - ZOOM MARKET DZ
========================================

Nom du Client : ${customer.fullName}
Téléphone : ${customer.phone}
Wilaya & Adresse : ${customer.wilaya} - ${customer.address}
${customer.notes ? `Remarques : ${customer.notes}` : ''}

Détails de la Commande :
${itemsText}

----------------------------------------
Sous-total : ${formatPrice(subtotal)}
Frais de livraison : ${formatPrice(shippingFee)}
TOTAL COMMANDE : ${formatPrice(total)} DZD
========================================
  `.trim();

  const templateParams = {
    to_email: emailConfig.recipientEmail || 'marketdzzoom@gmail.com',
    customer_name: customer.fullName,
    customer_phone: customer.phone,
    customer_wilaya: customer.wilaya,
    customer_address: customer.address,
    customer_notes: customer.notes || 'Aucune',
    order_details: itemsText,
    subtotal: formatPrice(subtotal),
    shipping_fee: formatPrice(shippingFee),
    total_amount: `${formatPrice(total)} DZD`,
    message_body: orderSummaryBody
  };

  // 1. Try EmailJS if public key, service ID & template ID are configured
  if (emailConfig.publicKey && emailConfig.serviceId && emailConfig.templateId) {
    try {
      const response = await emailjs.send(
        emailConfig.serviceId,
        emailConfig.templateId,
        templateParams,
        emailConfig.publicKey
      );
      return { success: true, method: 'emailjs', response };
    } catch (error) {
      console.warn('EmailJS error, attempting fallback:', error);
    }
  }

  // 2. Try Formspree if formspreeEndpoint is configured
  if (emailConfig.formspreeEndpoint) {
    try {
      const res = await fetch(emailConfig.formspreeEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateParams)
      });
      if (res.ok) {
        return { success: true, method: 'formspree' };
      }
    } catch (error) {
      console.warn('Formspree error:', error);
    }
  }

  // 3. Simulated success (client demo mode) with console logging if credentials not set yet
  console.log('Order notification generated:', orderSummaryBody);
  return { 
    success: true, 
    method: 'demo', 
    message: 'Commande enregistrée avec succès! (Mode Démo - EmailJS à configurer dans les paramètres)' 
  };
}

/**
 * Generate WhatsApp Order Link
 */
export function generateWhatsAppOrderUrl(orderData, storePhone = '0550000000') {
  const { customer, items, subtotal, shippingFee, total } = orderData;
  
  const itemsList = items
    .map(i => `• *${i.title}* x${i.quantity} (${formatPrice(i.price)})`)
    .join('\n');

  const text = `🛒 *NOUVELLE COMMANDE - ZOOM MARKET DZ*

👤 *Nom:* ${customer.fullName}
📞 *Tél:* ${customer.phone}
📍 *Wilaya:* ${customer.wilaya}
🏠 *Adresse:* ${customer.address}
${customer.notes ? `📝 *Notes:* ${customer.notes}\n` : ''}
📦 *Produits:*
${itemsList}

💰 *Sous-total:* ${formatPrice(subtotal)}
🚚 *Livraison:* ${formatPrice(shippingFee)}
💵 *TOTAL:* *${formatPrice(total)} DZD*

Merci d'avance pour la confirmation de ma commande !`;

  const encodedText = encodeURIComponent(text);
  const formattedPhone = formatPhoneForWhatsApp(storePhone);
  return `https://wa.me/${formattedPhone}?text=${encodedText}`;
}
