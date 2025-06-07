const ProfileRejection = (firstName, rejectionReason) => {
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
          background-color: #e04a4a; /* Red for rejection */
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
        .reason-box {
          background-color: #ffebee; /* Light red background */
          border-left: 4px solid #e04a4a; /* Red border */
          padding: 15px;
          margin: 15px 0;
        }
        .footer {
          margin-top: 20px;
          font-size: 12px;
          text-align: center;
          color: #888;
        }
        .highlight {
          color: #e04a4a; /* Red for rejection */
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Profile Update Required</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${firstName}</strong>,</p>
          <p>We regret to inform you that your profile needs some updates before it can be approved.</p>

          <div class="reason-box">
            <p><strong>Reason for rejection:</strong></p>
            <p>${rejectionReason || 'No specific reason provided.'}</p>
          </div>

          <p>Please log in to your account and update your profile information accordingly. Once updated, your profile will be reviewed again.</p>
          <p>If you have any questions, please contact the hostel administration.</p>
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

module.exports = ProfileRejection;
