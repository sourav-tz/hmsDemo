const ProfileApproval = (firstName) => {
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
        .success-message {
          font-size: 18px;
          font-weight: bold;
          margin: 15px 0;
          padding: 15px;
          background-color: #eafaf1; /* Light green background */
          border-radius: 5px;
          border-left: 4px solid #2ecc71; /* Green border */
          color: #2ecc71; /* Green text */
        }
        .footer {
          margin-top: 20px;
          font-size: 12px;
          text-align: center;
          color: #888;
        }
        .highlight {
          color: #4CAF50; /* Green for approval */
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Profile Approved</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${firstName}</strong>,</p>

          <div class="success-message">
            Your profile has been approved by the hostel administration.
          </div>

          <p>Your account has been upgraded from temporary to permanent status. You can now log in to the NIT Hostel Management System with your registered email and password to access all student features.</p>
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

module.exports = ProfileApproval;
