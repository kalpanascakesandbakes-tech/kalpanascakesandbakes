export const generateWhatsAppLink = (orderData) => {
  // User's provided phone number for testing
  const phoneNumber = "919967949880"; 

  let message = `*New Order: ${orderData.orderId}*\n\n`;
  message += `*Customer Details*\n`;
  message += `Name: ${orderData.customerName}\n`;
  message += `Phone: ${orderData.phone}\n`;
  message += `Address: ${orderData.address}\n\n`;

  message += `*Order Items*\n`;
  orderData.cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name} (${item.flavor})\n`;
    message += `   Weight: ${item.weight}\n`;
    message += `   Qty: ${item.quantity}\n`;
    if (item.eggless) message += `   Type: Eggless\n`;
    if (item.nameOnCake) message += `   Name on Cake: ${item.nameOnCake}\n`;
    if (item.message) message += `   Message: ${item.message}\n`;
  });

  message += `\n*Grand Total: ₹${orderData.totalAmount}*`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};
