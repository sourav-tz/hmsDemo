const { Application , students,hostelauthoritys ,courses} = require('../../../models');
const { NotifyNewHostelAdminEmail, NotifyOldHostelAdminEmail,NotifyStudentOnTransferEmail } = require('../../../MailTemplates/HostelTransfer');
const mailSender = require('../../../utils/mailSender');
// const { Sequelize } = require('sequelize');
// or wherever your Sequelize instance is configured
// Get all applications forwarded to super admin
exports.getAllForwardedApplications = async (req, res) => {
  try {
    const { status } = req.query; // frontend can send ?status=resolved etc.

    const applications = await Application.findAll({
      where: {
        status: status || 'pendingAtSuperAdmin' // default to 'pendingAtSuperAdmin' if not provided
      }
    });

    res.status(200).json({
      message: 'Applications fetched successfully',
      applications
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};


exports.approveBySuperAdmin = async (req, res) => {
  try {
    const applicationId = req.params.id;
    console.log("hello")
    console.log(req.body);
    const application = await Application.findOne({
      where: {
        applicationId,
        status: 'pendingAtSuperAdmin'
      }
    });

    if (!application) {
      return res.status(404).json({
        error: 'Application not found or already processed'
      });
    }

    const { forwardedTo: oldHostelNo, extraData, createdBy } = application.dataValues;
    const rollNos = extraData.rollNos || [createdBy];
    const toHostelNo = extraData.hostelNo;
    const isBulk = rollNos.length > 1;

    const studentsList = await students.findAll({
      where: { rollNo: rollNos },
      include: [{
        model: courses,
        attributes: ['courseName']
      }]
    });

    if (studentsList.length !== rollNos.length) {
      const missingRollNos = rollNos.filter(r =>
        !studentsList.some(s => s.rollNo === r)
      );
      return res.status(404).json({
        error: 'Some students not found',
        missingRollNos
      });
    }

    const [newHostelAdmin, oldHostelAdmin] = await Promise.all([
      hostelauthoritys.findOne({ where: { hostelNo: toHostelNo } }),
      hostelauthoritys.findOne({ where: { hostelNo: oldHostelNo } })
    ]);

    if (!newHostelAdmin || !oldHostelAdmin) {
      return res.status(404).json({
        error: 'Hostel admins not found',
        details: {
          newHostelExists: !!newHostelAdmin,
          oldHostelExists: !!oldHostelAdmin
        }
      });
    }

    await students.update(
      { hostelNo: toHostelNo, roomId: null },
      { where: { rollNo: rollNos } }
    );

    const emailTasks = studentsList.map(student => {
      const name = `${student.firstName} ${student.lastName}`;
      const courseName = student.course?.courseName || 'Unknown Course';

      return {
        studentEmail: student.email,
        newHostelEmail: NotifyNewHostelAdminEmail(name, student.rollNo, courseName, oldHostelNo, toHostelNo),
        oldHostelEmail: NotifyOldHostelAdminEmail(name, student.rollNo, courseName, oldHostelNo, toHostelNo),
        studentNotification: NotifyStudentOnTransferEmail(name, student.rollNo, courseName, oldHostelNo, toHostelNo)
      };
    });

    await Promise.all([
      mailSender(
        newHostelAdmin.email,
        `New Student${rollNos.length > 1 ? 's' : ''} Transfer to Your Hostel`,
        emailTasks.map(t => t.newHostelEmail).join('<hr>')
      ),
      mailSender(
        oldHostelAdmin.email,
        `Student${rollNos.length > 1 ? 's' : ''} Transferred From Your Hostel`,
        emailTasks.map(t => t.oldHostelEmail).join('<hr>')
      ),
      ...emailTasks.map(task =>
        mailSender(
          task.studentEmail,
          'Hostel Transfer Approved',
          task.studentNotification
        )
      )
    ]);

    await Application.update(
      { status: 'approvedBySuperAdmin' },
      { where: { applicationId } }
    );

    res.status(200).json({
      success: true,
      message: `Approved transfer for ${rollNos.length} student${rollNos.length > 1 ? 's' : ''}`,
      data: {
        applicationId,
        transferredStudents: rollNos.length,
        fromHostel: oldHostelNo,
        toHostel: toHostelNo
      }
    });

  } catch (error) {
    console.error('Approval process failed:', error);
    res.status(500).json({
      error: 'Approval processing failed',
      details: error.message
    });
  }
};

// Reject application by super admin
exports.rejectBySuperAdmin = async (req, res) => {
  try {
    const applicationId = req.params.id;

    const [updatedCount] = await Application.update(
      { status: 'rejectedBySuperAdmin' },
      {
        where: {
          applicationId,
          forwardedTo: 'superadmin',
          status: 'pendingAtSuperAdmin'
        }
      }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ error: 'Application not found or not eligible for rejection' });
    }

    res.status(200).json({ message: 'Application rejected by super admin' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to reject application' });
  }
};

