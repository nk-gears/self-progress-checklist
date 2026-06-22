// Google Apps Script Web App — receives feedback submissions from the
// Self Progress Checklist app and appends each one as a new row in a
// Google Sheet. One user can submit multiple times; every submission
// is logged as its own row (no de-duplication).
//
// Setup:
//   1. Create/open a Google Sheet to store feedback.
//   2. Extensions > Apps Script, paste this file's contents.
//   3. Update SHEET_NAME below if you want a different tab name
//      (the script creates the tab and header row automatically).
//   4. Deploy > New deployment > type "Web app".
//        - Execute as: Me
//        - Who has access: Anyone
//   5. Copy the deployment URL into the project's .env as
//      VITE_FEEDBACK_API_URL=<deployment URL>
//
// Note: the frontend sends the request with mode: 'no-cors', so the
// POST body arrives as plain text (e.is.postData.contents) rather than
// as parsed form fields — it must be JSON.parse()'d here.

const SHEET_NAME = 'Feedback'

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)

    const sheet = getOrCreateSheet_()
    sheet.appendRow([
      new Date(),
      data.submittedAt || '',
      data.name || '',
      data.email || '',
      data.centreName || '',
      data.rating || '',
      data.feedback || '',
      data.improvement || '',
    ])

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON)
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

function getOrCreateSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(SHEET_NAME)
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME)
    sheet.appendRow([
      'Received At', 'Submitted At (client)', 'Name', 'Email',
      'Centre / Pathashala', 'Rating', 'Feedback', 'Areas of Improvement',
    ])
  }
  return sheet
}
