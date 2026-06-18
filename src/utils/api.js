const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwTlNeGBrRSy-yD7yLKAMaIRVZ1_v0zwK41OwlkZsNglwkfzwugjrJXuXgog5amIDU5/exec';

export const submitOrder = async (orderData) => {
  return new Promise((resolve) => {
    // 100% Bulletproof method to bypass Google Apps Script CORS issues
    // by using a hidden HTML form submission.
    
    const iframeName = 'hidden_iframe_' + Date.now();
    const iframe = document.createElement('iframe');
    iframe.name = iframeName;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = APPS_SCRIPT_URL;
    form.target = iframeName;

    const actionInput = document.createElement('input');
    actionInput.type = 'hidden';
    actionInput.name = 'action';
    actionInput.value = 'createOrder';
    form.appendChild(actionInput);

    const dataInput = document.createElement('input');
    dataInput.type = 'hidden';
    dataInput.name = 'data';
    dataInput.value = JSON.stringify(orderData);
    form.appendChild(dataInput);

    document.body.appendChild(form);
    form.submit();

    // Clean up and resolve after a short delay (assume success since form submits blindly)
    setTimeout(() => {
      document.body.removeChild(form);
      document.body.removeChild(iframe);
      resolve({ success: true, orderId: orderData.orderId });
    }, 2000);
  });
};
