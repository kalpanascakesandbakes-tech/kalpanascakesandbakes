function doPost(e) {
  try {
    let action, data;
    
    // Parse the incoming request data robustly
    if (e.postData && e.postData.contents) {
      try {
        // Try parsing as raw JSON first (e.g. from fetch)
        const json = JSON.parse(e.postData.contents);
        action = json.action;
        data = json.data;
      } catch (err) {
        // Fallback: Try parsing from form-urlencoded parameters
        action = e.parameter.action;
        data = JSON.parse(e.parameter.data);
      }
    } else {
      action = e.parameter.action;
      data = JSON.parse(e.parameter.data);
    }

    // Connect to the spreadsheet
    let ss;
    try {
      // Container-bound script (recommended: automatically uses the current sheet)
      ss = SpreadsheetApp.getActiveSpreadsheet();
    } catch (err) {
      // Standalone script fallback
      ss = SpreadsheetApp.openById('1AbiOUd98VloPlTuT5-Yxmq5Wj33434uwh2Ba6y4JYPs');
    }
    
    const sheet = ss.getSheetByName('Orders') || ss.getSheets()[0];
    
    if (action === 'createOrder') {
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
    } else if (action === 'createBulkOrder') {
      const bulkSheet = ss.getSheetByName('Bulk Order') || ss.insertSheet('Bulk Order');
      
      // Ensure headers exist
      if (bulkSheet.getLastRow() === 0) {
        bulkSheet.appendRow([
          'Request ID', 'Date', 'Full Name', 'Company Name', 'Email', 'Phone',
          'Quantity', 'Delivery Date', 'Specific Requirements', 'Status'
        ]);
      }
      
      bulkSheet.appendRow([
        data.requestId,
        new Date(),
        data.name,
        data.companyName || '',
        data.email,
        data.phone,
        data.quantity,
        data.deliveryDate,
        data.notes || '',
        'Received'
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
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
