const ApplicationDetailsEmail = (name, applicationNumber) => {
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
        .content .application-number {
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          margin: 20px 0;
          color: #0044cc;
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
          <h1>Guest Room Application Received</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${name}</strong>,</p>
          <p>Thank you for submitting your application to NIT Kurukshetra.</p>
          <p>Your application number is:</p>
          <div class="application-number">${applicationNumber}</div>
          <p>You can check the status of your application anytime by visiting our website using this application number.</p>
          <p>If you have any questions, feel free to contact our support team.</p>
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
  
  module.exports = ApplicationDetailsEmail;
  