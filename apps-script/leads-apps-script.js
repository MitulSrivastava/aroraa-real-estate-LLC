var OWNER_EMAIL = 'aroraarealestate@gmail.com';   // 👈 set a real email

function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    var timestamp       = Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss");
    var fullName        = e.parameter.full_name        || '';
    var email           = e.parameter.email            || '';
    var phone           = e.parameter.phone            || '';
    var investmentRange = e.parameter.investment_range || '';
    var message         = e.parameter.message          || '';
    var interestedIn    = e.parameter.interested_in    || '';
    var sourceUrl       = e.parameter.source_url       || '';

    if (fullName || email || phone) {
      // Columns: Timestamp | Full Name | Email | Phone | Investment Range | Message | Interested In | Source URL
      sheet.appendRow([timestamp, fullName, email, phone, investmentRange, message, interestedIn, sourceUrl]);

      MailApp.sendEmail({
        to: OWNER_EMAIL,
        replyTo: email || OWNER_EMAIL,
        subject: 'New Website Lead: ' + (fullName || 'Unknown') + (interestedIn ? ' — ' + interestedIn : ''),
        body:
          'New enquiry from the website.\n\n' +
          'Name: '             + fullName        + '\n' +
          'Email: '            + email           + '\n' +
          'Phone: '            + phone           + '\n' +
          'Investment Range: ' + investmentRange + '\n' +
          'Interested In: '    + interestedIn    + '\n' +
          'Message: '          + message         + '\n' +
          'Page: '             + sourceUrl       + '\n' +
          'Time: '             + timestamp       + '\n'
      });
    }

    return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function testEmail() {
  MailApp.sendEmail('aroraarealestate@gmail.com', 'Test from Apps Script', 'If you got this, email works!');
}

function doPost(e) { return doGet(e); }
