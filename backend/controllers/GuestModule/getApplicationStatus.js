const { guestInfo } = require("../../models");

const getApplicationStatus = async (req, res) => {
  try {
    const { application_id } = req.params; // Get application_id from URL params

    // Validation: Check if application_id is a valid number
    if (!application_id || isNaN(application_id)) {
      return res.status(400).json({
        message: "Invalid application ID. It should be a valid integer.",
      });
    }

    // Find the guest information by application_id
    const guestApplication = await guestInfo.findOne({
      where: { application_id },
    });

    // If no record is found, return a 404 not found error
    if (!guestApplication) {
      return res.status(404).json({
        message: `No guest application found with application ID: ${application_id}`,
      });
    }

    // Return the status of the application
    return res.status(200).json({
      application_id: guestApplication.application_id,
      status: guestApplication.status,
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while fetching the application status.",
    });
  }
};

module.exports = getApplicationStatus;
