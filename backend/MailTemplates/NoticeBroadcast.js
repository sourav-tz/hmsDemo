const NoticeBroadcast = ({ studentName, noticeTitle, noticeUrl, audienceLabel, uploadedByLabel }) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        background: #f4f6fb;
        color: #1f2937;
      }
      .container {
        max-width: 620px;
        margin: 24px auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
      }
      .header {
        background: #1f2a60;
        color: #ffffff;
        padding: 20px 24px;
      }
      .header h1 {
        margin: 0;
        font-size: 22px;
      }
      .content {
        padding: 22px 24px;
      }
      .meta {
        background: #eef2ff;
        border-left: 4px solid #4f46e5;
        padding: 12px 14px;
        border-radius: 6px;
        margin: 16px 0;
      }
      .notice-title {
        font-size: 18px;
        font-weight: 700;
        margin: 10px 0 0 0;
      }
      .cta {
        display: inline-block;
        margin-top: 18px;
        background: #4f46e5;
        color: #ffffff !important;
        text-decoration: none;
        padding: 10px 16px;
        border-radius: 8px;
        font-weight: 600;
      }
      .footer {
        font-size: 12px;
        color: #6b7280;
        padding: 0 24px 20px 24px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>New Hostel Notice</h1>
      </div>
      <div class="content">
        <p>Dear ${studentName || 'Student'},</p>
        <p>A new notice has been uploaded for <strong>${audienceLabel}</strong>.</p>
        <p class="notice-title">${noticeTitle || 'Untitled Notice'}</p>
        <div class="meta">
          Uploaded by: <strong>${uploadedByLabel}</strong>
        </div>
        <a class="cta" href="${noticeUrl}" target="_blank" rel="noopener noreferrer">View Notice</a>
        <p style="margin-top: 20px;">Regards,<br/>NIT Hostel Management System</p>
      </div>
      <div class="footer">
        This is an automated email. Please do not reply to this message.
      </div>
    </div>
  </body>
  </html>
  `;
};

module.exports = NoticeBroadcast;
