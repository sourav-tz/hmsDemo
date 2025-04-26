const NotifyNewHostelAdminEmail = (studentName, rollNo, branch, fromHostelNo, toHostelNo) => {
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
          background-color: #28a745;
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
        .student-details {
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
          <h1>Student Transfer Notification</h1>
        </div>
        <div class="content">
          <p>Dear Hostel Admin,</p>
          <p>The following student has been transferred <strong>from Hostel No. ${fromHostelNo}</strong> to your hostel, <strong>Hostel No. ${toHostelNo}</strong>. Please arrange a suitable room for accommodation.</p>

          <div class="student-details">
            <p><strong>Name:</strong> ${studentName}</p>
            <p><strong>Roll No:</strong> ${rollNo}</p>
            <p><strong>Branch:</strong> ${branch}</p>
            <p><strong>Previous Hostel:</strong> ${fromHostelNo}</p>
            <p><strong>New Hostel:</strong> ${toHostelNo}</p>
          </div>

          <p>Thank you for your cooperation.</p>
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

const NotifyOldHostelAdminEmail = (studentName, rollNo, branch, fromHostelNo, toHostelNo) => {
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
          background-color: #dc3545;
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
        .student-details {
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
          <h1>Student Transfer Out Notification</h1>
        </div>
        <div class="content">
          <p>Dear Hostel Admin,</p>
          <p>Please be informed that the following student has been transferred <strong>from your hostel (Hostel No. ${fromHostelNo})</strong> to <strong>Hostel No. ${toHostelNo}</strong>.</p>

          <div class="student-details">
            <p><strong>Name:</strong> ${studentName}</p>
            <p><strong>Roll No:</strong> ${rollNo}</p>
            <p><strong>Branch:</strong> ${branch}</p>
            <p><strong>Previous Hostel:</strong> ${fromHostelNo}</p>
            <p><strong>New Hostel:</strong> ${toHostelNo}</p>
          </div>

          <p>Kindly update your records accordingly.</p>
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


const NotifyStudentOnTransferEmail = (name, rollNo, courseName, fromHostelNo, toHostelNo) => {
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
          background-color: #28a745;
          padding: 20px;
          text-align: center;
          color: #fff;
          border-radius: 10px 10px 0 0;
        }
        .header h1 {
          margin: 0;
          font-size: 22px;
        }
        .content {
          padding: 20px;
          background-color: #fff;
          border-radius: 0 0 10px 10px;
        }
        .content p {
          font-size: 16px;
        }
        .details {
          font-size: 16px;
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
          <h1>Hostel Transfer Approved</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${name}</strong>,</p>
          <p>Your request for hostel transfer has been successfully approved.</p>
          <div class="details">
            <p><strong>Roll No:</strong> ${rollNo}</p>
            <p><strong>Course:</strong> ${courseName}</p>
            <p><strong>Previous Hostel No:</strong> ${fromHostelNo}</p>
            <p><strong>New Hostel No:</strong> ${toHostelNo}</p>
          </div>
          <p>Please wait for further instructions from your new hostel warden to get your room allotted.</p>
          <p>We wish you a smooth transition!</p>
          <p>Best regards,<br>The Hostel Management Team</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} NIT Kurukshetra. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};



module.exports = {
  NotifyNewHostelAdminEmail,
  NotifyOldHostelAdminEmail,
  NotifyStudentOnTransferEmail,
};
