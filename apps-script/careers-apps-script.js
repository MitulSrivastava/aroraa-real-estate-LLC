var OWNER_EMAIL = 'aroraarealestate@gmail.com';   // 👈 set a real email

function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    var timestamp    = Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss");
    var fullName     = e.parameter.full_name     || '';
    var email        = e.parameter.email         || '';
    var phone        = e.parameter.phone         || '';
    var position     = e.parameter.position      || '';
    var message      = e.parameter.message       || '';
    var sourceUrl    = e.parameter.source_url    || '';

    if (fullName || email || phone) {
      // NOTE: Make sure your Google Sheet columns match this order:
      // A: Timestamp, B: Full Name, C: Email, D: Phone, E: Position, F: Message, G: Source URL
      sheet.appendRow([timestamp, fullName, email, phone, position, message, sourceUrl]);

      MailApp.sendEmail({
        to: OWNER_EMAIL,
        replyTo: email || OWNER_EMAIL,
        subject: 'New Job Application: ' + (fullName || 'Unknown') + (position ? ' — ' + position : ''),
        body:
          'New career application from the website.\n\n' +
          'Name: '             + fullName        + '\n' +
          'Email: '            + email           + '\n' +
          'Phone: '            + phone           + '\n' +
          'Position: '         + position        + '\n' +
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
  MailApp.sendEmail('aroraarealestate@gmail.com', 'Test from Apps Script', 'If you got this, then careers emails works!');
}

function doPost(e) { return doGet(e); }
