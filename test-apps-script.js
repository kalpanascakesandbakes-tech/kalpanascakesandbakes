const url = 'https://script.google.com/macros/s/AKfycbwTlNeGBrRSy-yD7yLKAMaIRVZ1_v0zwK41OwlkZsNglwkfzwugjrJXuXgog5amIDU5/exec';

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

const formData = new URLSearchParams();
formData.append('action', 'createOrder');
formData.append('data', JSON.stringify(orderData));

async function test() {
  console.log('Sending test data to Apps Script...');
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      redirect: 'follow'
    });
    const text = await response.text();
    console.log('Response Status:', response.status);
    console.log('Response Body:', text);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
