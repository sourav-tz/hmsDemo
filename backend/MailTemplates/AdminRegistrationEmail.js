const AdminRegistrationEmail = (name, password, hostelNo) => {
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
          .credentials {
            font-size: 18px;
            font-weight: bold;
            margin: 15px 0;
            padding: 10px;
            background-color: #f3f3f3;
            border-radius: 5px;
          }
          .footer {
            margin-top: 20px;
            font-size: 12px;
            text-align: center;
            color: #888;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Admin Registration Successful</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${name}</strong>,</p>
            <p>Congratulations! You have been successfully registered as an admin for <strong>Hostel No. ${hostelNo}</strong>.</p>
            
            <p>Your login credentials are:</p>
            <div class="credentials">
              <p><strong>Username:</strong> ${name}</p>
              <p><strong>Password:</strong> ${password}</p>
            </div>
  
            <p>Please keep these credentials safe. You can change your password after logging in for the first time.</p>
  
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
  
  module.exports = AdminRegistrationEmail;