function doGet(e) {
  return handleResponse(e);
}

function doPost(e) {
  return handleResponse(e);
}

function handleResponse(e) {
  // Put a lock on the script so we don't have overlapping executions
  var lock = LockService.getScriptLock();
  lock.waitLock(30000); // wait 30 seconds before giving up
  
  // =========================================================================
  // ⚙️ CONFIGURATION
  // =========================================================================
  // The email address where you want to receive lead notifications
  var NOTIFICATION_EMAIL = "aroraarealestate@gmail.com"; 
  // =========================================================================
  
  try {
    // Get the active spreadsheet and the first sheet
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheets()[0];
    
    // Get the headers from the first row
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow() + 1; // get next row
    var row = []; 
    
    var timestamp = new Date();
    
    // Define a mapping between the HTML form's `name` attributes and your Sheet Headers.
    var fieldMapping = {
      'Name': e.parameter.full_name || e.parameter.name || '',
      'Email': e.parameter.email || '',
      'Phone': e.parameter.phone || '',
      'Subject': e.parameter.subject || e.parameter.interested_in || 'New Inquiry aroraa real estate llc',
      'Investment Range': e.parameter.investment_range || e.parameter.investmentRange || '',
      'Message': e.parameter.message || '',
      'Token': e.parameter.token || '',
      'Session ID': e.parameter.session_id || '',
      'Event ID': e.parameter.event_id || '',
      'First Source': e.parameter.first_source || '',
      'First Medium': e.parameter.first_medium || '',
      'First Campaign': e.parameter.first_campaign || '',
      'First GCLID': e.parameter.first_gclid || '',
      'Entry Time': e.parameter.entry_time || '',
      'Latest Source': e.parameter.latest_source || '',
      'Latest Medium': e.parameter.latest_medium || '',
      'Latest Campaign': e.parameter.latest_campaign || '',
      'Latest GCLID': e.parameter.latest_gclid || '',
      'Latest Keyword': e.parameter.latest_keyword || '',
      'Latest Content': e.parameter.latest_content || '',
      'Latest Referrer': e.parameter.latest_referrer || '',
      'Landing Page': e.parameter.landing_page || '',
      'Page URL': e.parameter.source_url || e.parameter.page_url || '',
      'Page Title': e.parameter.page_title || 'Aroraa Real Estate LLC',
      'Latest Timestamp': e.parameter.latest_timestamp || ''
    };

    // Only save the lead if a phone number or email was provided
    // This blocks bots from submitting empty rows without affecting real leads
    if (!fieldMapping['Phone'] && !fieldMapping['Email']) {
      return ContentService.createTextOutput("Ignored empty bot request.");
    }

    // Loop through the header columns
    for (var i = 0; i < headers.length; i++) {
      var header = headers[i];
      if (header === 'Timestamp') {
        row.push(timestamp); 
      } else {
        row.push(fieldMapping[header] !== undefined ? fieldMapping[header] : "");
      }
    }
    
    // Append the row to the bottom of the sheet
    sheet.appendRow(row);
    
    // =========================================================================
    // ✉️ SEND BEAUTIFUL EMAIL NOTIFICATION
    // =========================================================================
    if (NOTIFICATION_EMAIL && NOTIFICATION_EMAIL !== "your-email@example.com") {
      sendBeautifulEmail(fieldMapping, timestamp, NOTIFICATION_EMAIL);
    }
    
    // Return a success response
    return ContentService
          .createTextOutput(JSON.stringify({"result": "success", "row": nextRow}))
          .setMimeType(ContentService.MimeType.JSON);
          
  } catch(error) {
    // Return an error response if something goes wrong
    return ContentService
          .createTextOutput(JSON.stringify({"result": "error", "error": error.message}))
          .setMimeType(ContentService.MimeType.JSON);
  } finally {
    // Release the lock
    lock.releaseLock();
  }
}

function sendBeautifulEmail(data, dateObj, toEmail) {
  // Format Date (e.g., 2026-09-02 21:31:58)
  var dateStr = Utilities.formatDate(dateObj, "Asia/Dubai", "yyyy-MM-dd HH:mm:ss") + " (Dubai Time)";
  
  // Extract project name from Page Title or use a default
  var projectName = data['Page Title'] ? data['Page Title'].split('|')[0].trim().toUpperCase() : "ARORAA REAL ESTATE LLC";
  // Add LLC if missing from the parsed title
  if (projectName === "ARORAA REAL ESTATE") {
    projectName = "ARORAA REAL ESTATE LLC";
  }
  
  // Cleanup Phone for links (remove spaces, etc)
  var cleanPhone = data['Phone'].replace(/[^0-9\+]/g, '');
  if (!cleanPhone.startsWith('+') && cleanPhone.length > 0) {
     // Default to +971 if no country code provided, just to be safe
     if (cleanPhone.length <= 10) cleanPhone = '+971' + cleanPhone;
     else cleanPhone = '+' + cleanPhone;
  }

  // Construct HTML Body matching the screenshot design
  var htmlBody = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #eaeaea;">
    
    <!-- Header -->
    <div style="background-color: #0d1117; color: #c9a55f; padding: 40px 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px;">${projectName}</h1>
      <p style="margin: 10px 0 0 0; color: #8b949e; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">NEW LEAD NOTIFICATION</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 30px;">
      
      <!-- Badge & Timestamp -->
      <div style="margin-bottom: 25px;">
        <span style="display: inline-block; background-color: #2196F3; color: white; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: bold;">
          ${data['Subject'] || 'New Inquiry aroraa real estate llc'}
        </span>
        <div style="color: #888; font-size: 12px; margin-top: 10px;">
          Received at ${dateStr}
        </div>
      </div>
      
      <!-- Data Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; border-radius: 6px; overflow: hidden; box-shadow: 0 0 0 1px #eaeaea;">
        <tr style="background-color: #f9f9f9; border-bottom: 1px solid #eaeaea;">
          <td style="padding: 15px; color: #666; font-size: 13px; width: 120px;">Full Name</td>
          <td style="padding: 15px; color: #333; font-size: 14px; font-weight: 500;">${data['Name'] || '-'}</td>
        </tr>
        <tr style="background-color: #ffffff; border-bottom: 1px solid #eaeaea;">
          <td style="padding: 15px; color: #666; font-size: 13px;">Email</td>
          <td style="padding: 15px; font-size: 14px;"><a href="mailto:${data['Email']}" style="color: #c9a55f; text-decoration: none;">${data['Email'] || '-'}</a></td>
        </tr>
        <tr style="background-color: #f9f9f9; border-bottom: 1px solid #eaeaea;">
          <td style="padding: 15px; color: #666; font-size: 13px;">Phone</td>
          <td style="padding: 15px; font-size: 14px;"><a href="tel:${cleanPhone}" style="color: #c9a55f; text-decoration: none;">${data['Phone'] || '-'}</a></td>
        </tr>
        <tr style="background-color: #ffffff; border-bottom: 1px solid #eaeaea;">
          <td style="padding: 15px; color: #666; font-size: 13px;">Investment Range</td>
          <td style="padding: 15px; font-size: 14px; color: #333;">${data['Investment Range'] || '-'}</td>
        </tr>
        <tr style="background-color: #f9f9f9; border-bottom: 1px solid #eaeaea;">
          <td style="padding: 15px; color: #666; font-size: 13px;">URL / Source</td>
          <td style="padding: 15px; font-size: 13px; color: #666;">
            <a href="${data['Page URL']}" style="color: #c9a55f;">Page</a> | 
            Source: ${data['First Source'] || 'Direct'}
          </td>
        </tr>
      </table>
      
      <!-- Action Buttons -->
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="width: 33%; padding-right: 5px;">
            <a href="tel:${cleanPhone}" style="display: block; text-align: center; background-color: #dfb138; color: #000; text-decoration: none; padding: 12px 0; border-radius: 6px; font-weight: bold; font-size: 14px;">
              📞 Call Now
            </a>
          </td>
          <td style="width: 33%; padding: 0 5px;">
            <a href="https://wa.me/${cleanPhone.replace('+','')}" style="display: block; text-align: center; background-color: #25D366; color: #fff; text-decoration: none; padding: 12px 0; border-radius: 6px; font-weight: bold; font-size: 14px;">
              💬 WhatsApp
            </a>
          </td>
          <td style="width: 33%; padding-left: 5px;">
            <a href="mailto:${data['Email']}" style="display: block; text-align: center; background-color: #333333; color: #fff; text-decoration: none; padding: 12px 0; border-radius: 6px; font-weight: bold; font-size: 14px;">
              ✉️ Email
            </a>
          </td>
        </tr>
      </table>
      
    </div>
    
    <!-- Footer -->
    <div style="background-color: #0d1117; color: #8b949e; text-align: center; padding: 25px 20px; font-size: 11px;">
      <p style="margin: 0 0 5px 0;">Aroraa Real Estate LLC — Official Channel Partner</p>
      <p style="margin: 0;">This is an automated notification from your landing page lead capture system.</p>
    </div>
    
  </div>
  `;

  var emailSubject = `New Lead: ${data['Name']} - ${projectName}`;
  
  MailApp.sendEmail({
    to: toEmail,
    subject: emailSubject,
    htmlBody: htmlBody
  });
}
