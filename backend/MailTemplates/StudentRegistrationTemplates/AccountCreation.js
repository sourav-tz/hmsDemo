const AccountCreation = (email, password) => {
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
        padding: 15px;
        background-color: #f3f3f3;
        border-radius: 5px;
        border-left: 4px solid #0044cc;
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
      .steps {
        margin: 20px 0;
        padding: 0;
      }
      .steps li {
        margin-bottom: 10px;
        list-style-type: decimal;
        margin-left: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to NIT Hostel Management System</h1>
      </div>
      <div class="content">
        <p>Hello,</p>
        <p>A temporary account has been created for you in the NIT Hostel Management System. Please use the following credentials to log in:</p>
        
        <div class="credentials">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Password:</strong> ${password}</p>
        </div>
        
        <p>After logging in, you will need to complete your profile information. Here's what to do next:</p>
        
        <ol class="steps">
          <li>Log in using the credentials above</li>
          <li>Complete your profile information on the Student Self Profiling page</li>
          <li>Submit your profile for approval</li>
          <li>Wait for admin verification (you will receive an email when your profile is approved or rejected)</li>
        </ol>
        
        <p><strong>Note:</strong> This is a temporary account that will expire in 7 days if you don't complete your profile. Please complete your profile as soon as possible.</p>
        
        <p>If you have any questions, please contact the hostel administration.</p>
        <p>Best regards,<br>The NIT Hostel Management Team</p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} NIT Kurukshetra. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
`;
};

module.exports = AccountCreation;
