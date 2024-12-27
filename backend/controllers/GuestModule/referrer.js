const { guestInfo } = require("../../models");

// Get pending applications
const getPendingApplication = async (req, res) => {
  try {
    const studentEmail = req.body.tokenEmail;
    if (!studentEmail) {
      return res.status(400).json({
        success: false,
        message: "email is required.",
      });
    }

    const result = await guestInfo.findAll({
      where: {
        referrer_email:studentEmail,
        status: "pendingAtReferrer", // Filtering applications with 'pending' status
      },
    });

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No pending applications found for the given referrer.",
      });
    }

    // console.log(result);
    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Reject application
const rejectApplication = async (req, res) => {
  try {
    const studentEmail = req.body.tokenEmail;
    const { application_id } = req.params;

    if (!application_id || !studentEmail) {
      return res.status(400).json({
        success: false,
        message: "Application ID and Email are required.",
      });
    }

    const application = await guestInfo.findOne({
      where: { application_id ,status:"pendingByReferrer"},
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    // Check if the roll number matches the first 9 characters of the referrer_email
    const referrerEmail = application.referrer_email;
    if (referrerEmail !== studentEmail) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to reject this application.",
      });
    }

    await guestInfo.update(
      { status: "rejectedByReferrer" },
      {
        where: {
          application_id,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Application successfully rejected.",
    });
  } catch (error) {
    console.error("Error rejecting application:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Accept application and forward to admin
const acceptApplication = async (req, res) => {
  try {
    const studentEmail = req.body.tokenEmail;
    const { application_id } = req.params;

    if (!application_id || !studentEmail) {
      return res.status(400).json({
        success: false,
        message: "Application ID and Email are required.",
      });
    }

    const application = await guestInfo.findOne({
      where: { application_id ,status:"pendingByReferrer"},
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    // Check if the roll number matches the first 9 characters of the referrer_email
    const referrerEmail = application.referrer_email;
    if (referrerEmail !== studentEmail) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to accept this application.",
      });
    }

    await guestInfo.update(
      { status: "pendingAtAdmin" }, // Update status to 'pendingAtAdmin'
      {
        where: {
          application_id,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Application successfully accepted and forwarded to admin.",
    });
  } catch (error) {
    console.error("Error accepting application:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getPendingApplication, rejectApplication, acceptApplication };
