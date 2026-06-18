function doPost(e) {
  try {
    const json = JSON.parse(e.postData.contents);
    const action = json.action;
    const data = json.data;

    const ss = SpreadsheetApp.openById('1yfEd26-JjAmvR1GpJQIMH1d9_646J7sNa_Nm7bHv2AQ');

    if (action === 'createOrder') {
      const sheet = ss.getSheetByName('Orders') || ss.insertSheet('Orders');
      
      // Ensure headers exist
      if (sheet.getLastRow() === 0) {
        sheet.appendRow([
          'Order ID', 'Date', 'Customer Name', 'Email', 'Phone', 'Address',
          'Items Details', 'Total Amount', 'Status', 'Notes'
        ]);
      }

      // Format Items Details
      const itemsString = data.cart.map(item => 
        `${item.name} (${item.flavor}) - ${item.weight} x${item.quantity} ${item.eggless ? '[Eggless]' : ''}`
      ).join(' | ');

      sheet.appendRow([
        data.orderId,
        new Date(),
        data.customerName,
        data.email,
        data.phone,
        data.address,
        itemsString,
        data.totalAmount,
        'Received', // Initial Status
        data.notes || ''
      ]);

      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Add logic for custom/bulk orders as needed...

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Function to handle GET request (e.g. for order tracking)
function doGet(e) {
  const orderId = e.parameter.orderId;
  
  if (orderId) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Orders');
    if (!sheet) return ContentService.createTextOutput(JSON.stringify({ error: "No orders found" }));
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const orderIdIndex = headers.indexOf('Order ID');
    const statusIndex = headers.indexOf('Status');
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][orderIdIndex] === orderId) {
        return ContentService.createTextOutput(JSON.stringify({ 
          orderId: orderId,
          status: data[i][statusIndex]
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ error: "Order not found" })).setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput("Backend is running.");
}
