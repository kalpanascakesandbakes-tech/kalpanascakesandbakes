const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbz-f4F-79kgial6i9r3U1Nfqry-OmMECgIWxo_MZcM8baBBYG54XUrU5JmP58RFZto/exec';

export const submitOrder = async (orderData) => {
  try {
    // We send a JSON POST request. 
    // To avoid CORS preflight issues, we use text/plain content-type and mode: 'no-cors'
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({
        action: 'createOrder',
        data: orderData
      })
    });
    return { success: true, orderId: orderData.orderId };
  } catch (error) {
    console.error('Error submitting order to Google Sheets:', error);
    throw error;
  }
};

export const submitBulkOrder = async (bulkData) => {
  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({
        action: 'createBulkOrder',
        data: bulkData
      })
    });
    return { success: true };
  } catch (error) {
    console.error('Error submitting bulk order to Google Sheets:', error);
    return { success: false, error };
  }
};
