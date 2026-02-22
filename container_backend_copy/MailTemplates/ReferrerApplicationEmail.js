const ReferrerApplicationEmail = (guestName, applicationNumber) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #333;
          line-height: 1.6;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 10px;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #0044cc;
          padding: 20px;
          text-align: center;
          color: #fff;
          border-radius: 10px 10px 0 0;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 20px;
          background-color: #fff;
          border-radius: 0 0 10px 10px;
        }
        .content p {
          font-size: 16px;
        }
        .footer {
          margin-top: 20px;
          font-size: 12px;
          text-align: center;
          color: #888;
        }
        .highlight {
          color: #0044cc;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Approval Needed for Guest Room Application</h1>
        </div>
        <div class="content">
          <p>Dear <strong>Student</strong>,</p>
          <p>A new guest room application has been submitted by <strong>${guestName}</strong> that requires your approval.</p>
          <p><strong>Application Number:</strong> ${applicationNumber}</p>
          <p>Please log in to the website to accept or reject the application.</p>
          <p>We appreciate your prompt attention to this matter.</p>
          <p>If you have any questions, please contact our support team.</p>
          <p>Thank you.</p>
          <p>Best regards,<br>The NIT Kurukshetra Team</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} NIT Kurukshetra. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;
};

module.exports = ReferrerApplicationEmail;
