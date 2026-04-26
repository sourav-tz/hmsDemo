const db = require('../models');
const mailSender = require('./mailSender');
const NoticeBroadcast = require('../MailTemplates/NoticeBroadcast');

const DEFAULT_BATCH_SIZE = 30;

const sendNoticeEmailsToStudents = async ({
  noticeTitle,
  noticeUrl,
  uploadedByLabel,
  hostelNo = null,
  isGlobal = false,
}) => {
  const whereClause = isGlobal ? {} : { hostelNo };

  const students = await db.students.findAll({
    where: whereClause,
    attributes: ['email', 'firstName'],
  });

  if (!students.length) {
    return { recipients: 0, sent: 0, failed: 0 };
  }

  const audienceLabel = isGlobal ? 'all hostels' : `hostel ${hostelNo}`;
  const batchSize = Number(process.env.NOTICE_EMAIL_BATCH_SIZE || DEFAULT_BATCH_SIZE);

  let sent = 0;
  let failed = 0;

  for (let i = 0; i < students.length; i += batchSize) {
    const batch = students.slice(i, i + batchSize);

    const results = await Promise.allSettled(
      batch.map((student) =>
        mailSender(
          student.email,
          `New Notice: ${noticeTitle || 'Hostel Notice'}`,
          NoticeBroadcast({
            studentName: student.firstName || 'Student',
            noticeTitle,
            noticeUrl,
            audienceLabel,
            uploadedByLabel,
          })
        )
      )
    );

    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        sent += 1;
      } else {
        failed += 1;
      }
    });
  }

  return {
    recipients: students.length,
    sent,
    failed,
  };
};

module.exports = { sendNoticeEmailsToStudents };
