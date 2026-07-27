export const generateWhatsAppLink = (orderData) => {
  // User's provided phone number for testing
  const phoneNumber = "919004762873"; 

  let message = `🎂 *New Order: ${orderData.orderId}* 🎂\n\n`;
  
  message += `👤 *Customer Details*\n`;
  message += `• *Name:* ${orderData.customerName}\n`;
  message += `• *Phone:* ${orderData.phone}\n`;
  if (orderData.email) {
    message += `• *Email:* ${orderData.email}\n`;
  }
  message += `• *Address:* ${orderData.address}\n\n`;

  message += `🍰 *Order Items*\n`;
  orderData.cart.forEach((item, index) => {
    const multipliers = {
      '0.5 KG': 1,
      '1 KG': 2,
      '1.5 KG': 3,
      '2 KG': 4,
      '3 KG': 6,
      '4 KG': 8,
      '5 KG': 10,
    };
    
    const isCustom = item.isCustomPricing;

    message += `*${index + 1}. ${item.name}*\n`;
    if (item.id) {
      message += `   • Code: #${item.id}\n`;
      message += `   • Product Link: https://kalpanascakes.com/cake/${item.id}\n`;
    }
    if (item.image) {
      const imgPath = item.image.startsWith('/') ? item.image : `/${item.image}`;
      message += `   • Design Image: https://kalpanascakes.com${imgPath}\n`;
    }
    if (item.flavor) {
      message += `   • Flavor: ${item.flavor}\n`;
    }
    message += `   • Weight: ${item.weight}\n`;
    
    if (isCustom) {
      message += `   • Price: Price on Request (To be confirmed)\n`;
      message += `   • Qty: ${item.quantity} (Subtotal: To be confirmed)\n`;
    } else {
      const unitPrice = item.price !== undefined && item.price !== null
        ? item.price
        : item.basePrice * (multipliers[item.weight] || 1);
      const subtotal = unitPrice * item.quantity;
      message += `   • Price: ₹${unitPrice} each\n`;
      message += `   • Qty: ${item.quantity} (Subtotal: ₹${subtotal})\n`;
    }

    if (item.nameOnCake) {
      message += `   • Name on Cake: "${item.nameOnCake}"\n`;
    }
    if (item.message) {
      message += `   • Message/Notes: ${item.message}\n`;
    }
  });

  const hasCustomPricingItems = orderData.cart.some(item => item.isCustomPricing);
  if (hasCustomPricingItems) {
    if (orderData.totalAmount > 0) {
      message += `\n💰 *Total Order Value:* ₹${orderData.totalAmount} + Price on Request items (to be confirmed)\n\n`;
    } else {
      message += `\n💰 *Total Order Value:* Price on Request (To be confirmed on WhatsApp)\n\n`;
    }
  } else {
    message += `\n💰 *Total Order Value:* ₹${orderData.totalAmount}\n\n`;
  }

  if (orderData.notes) {
    message += `📝 *Order Notes / Special Instructions*\n`;
    message += `${orderData.notes}\n\n`;
  }

  message += `💳 *Payment (GPay):* Please pay to *+91 90047 62873* and share the screenshot here.\n`;
  message += `-----------------------------\n`;
  message += `Thank you for ordering from *Kalpana's Cakes & Bakes*! ❤️`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};

export const generateBulkOrderWhatsAppLink = (bulkData) => {
  const phoneNumber = "919004762873"; 

  let message = `🏢 *New Corporate / Bulk Order Quote Request* 🏢\n\n`;
  message += `👤 *Contact Details*\n`;
  message += `• *Name:* ${bulkData.name}\n`;
  if (bulkData.companyName) {
    message += `• *Company/Org:* ${bulkData.companyName}\n`;
  }
  message += `• *Email:* ${bulkData.email}\n`;
  message += `• *Phone:* ${bulkData.phone}\n\n`;

  message += `📦 *Request Details*\n`;
  message += `• *Request ID:* ${bulkData.requestId}\n`;
  message += `• *Quantity:* ${bulkData.quantity} cakes/items\n`;
  message += `• *Expected Delivery Date:* ${bulkData.deliveryDate}\n`;
  if (bulkData.notes) {
    message += `• *Specific Requirements:* ${bulkData.notes}\n`;
  }
  
  message += `\n-----------------------------\n`;
  message += `Please review and provide a quote. Thank you!`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};

export const generateCustomCakeWhatsAppLink = (customData) => {
  const phoneNumber = "919004762873"; 

  let message = `🎂 *New Custom Cake Design Inquiry* 🎂\n\n`;
  
  message += `👤 *Inquiry Details*\n`;
  message += `• *Request ID:* ${customData.requestId}\n`;
  if (customData.theme) {
    message += `• *Theme/Occasion:* ${customData.theme}\n`;
  }
  message += `• *Flavor:* ${customData.flavor}\n`;
  message += `• *Weight:* ${customData.weight}\n`;
  message += `• *Quantity:* ${customData.quantity}\n`;
  
  if (customData.notes) {
    message += `\n📝 *Additional Notes*\n`;
    message += `"${customData.notes}"\n`;
  }
  
  if (customData.imageUrl) {
    message += `\n📸 *Reference Design Image Link*\n`;
    message += `• ${customData.imageUrl}\n`;
  } else if (customData.hasFile) {
    message += `\n📸 *Reference Design Attachment*\n`;
    message += `• _I will attach my custom design image as the next message in this chat._\n`;
  }

  message += `\n-----------------------------\n`;
  message += `Please review and provide pricing/details. Thank you!`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};

