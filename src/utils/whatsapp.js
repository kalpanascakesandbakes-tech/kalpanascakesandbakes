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
    message += `*${index + 1}. ${item.name}*\n`;
    message += `   • Flavor: ${item.flavor}\n`;
    message += `   • Weight: ${item.weight}\n`;
    message += `   • Quantity: ${item.quantity}\n`;
    if (item.nameOnCake) {
      message += `   • Name on Cake: "${item.nameOnCake}"\n`;
    }
    if (item.message) {
      message += `   • Message/Notes: ${item.message}\n`;
    }
  });

  if (orderData.notes) {
    message += `\n📝 *Order Notes / Special Instructions*\n`;
    message += `${orderData.notes}\n`;
  }

  message += `\n💵 *Grand Total:* ₹${orderData.totalAmount}\n`;
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
  
  if (customData.hasFile) {
    message += `\n📸 *Reference Design Attachment*\n`;
    message += `• _I will attach my custom design image as the next message in this chat._\n`;
  }

  message += `\n-----------------------------\n`;
  message += `Please review and provide pricing/details. Thank you!`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};

