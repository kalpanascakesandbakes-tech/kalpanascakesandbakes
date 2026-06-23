const url = 'https://script.google.com/macros/s/AKfycbz87fKS482cbW6U8eDBcUy9fan60XY69s0x-4qvXiNPqU6h2u87wSBc5w9CsggzVrV0/exec';

const orderData = {
  orderId: 'ORD-123456',
  customerName: 'Test Customer',
  email: 'test@example.com',
  phone: '1234567890',
  address: '123 Test St',
  notes: 'This is a test from the script',
  totalAmount: 1500,
  cart: [
    { name: 'Test Cake', flavor: 'Mango', weight: '1 KG', quantity: 1, eggless: false }
  ]
};

async function testJSON() {
  console.log('Sending JSON test data to Apps Script...');
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: JSON.stringify({
        action: 'createOrder',
        data: orderData
      }),
      redirect: 'follow'
    });
    const text = await response.text();
    console.log('JSON POST Response Status:', response.status);
    console.log('JSON POST Response Body:', text);
  } catch (err) {
    console.error('JSON POST Error:', err.message);
  }
}

async function testForm() {
  console.log('Sending Form test data to Apps Script...');
  const formData = new URLSearchParams();
  formData.append('action', 'createOrder');
  formData.append('data', JSON.stringify(orderData));

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      redirect: 'follow'
    });
    const text = await response.text();
    console.log('Form POST Response Status:', response.status);
    console.log('Form POST Response Body:', text);
  } catch (err) {
    console.error('Form POST Error:', err.message);
  }
}

async function runTests() {
  await testJSON();
  console.log('------------------');
  await testForm();
}

runTests();
