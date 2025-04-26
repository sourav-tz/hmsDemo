const { Application } = require('../../../models');

// fill by those values by which admin can approve directly 
const directlyApprovableTags = [];

// Get all applications forwarded to the admin's hostel
exports.getAllApplications = async (req, res) => {
  try {
    // const hostelNo = req.admin.hostelNo;
    const hostelNo = 5;
    const applications = await Application.findAll({
      where: {
        forwardedTo: hostelNo,
        status: 'pendingAtAdmin'
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

// Approve an application (only if tag is directly approvable)
exports.approveApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;
    // const hostelNo = req.admin.hostelNo;
    const hostelNo = 5;

    const application = await Application.findOne({
      where: {
        applicationId,
        forwardedTo: hostelNo,
        status: 'pendingAtAdmin'
      }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found or not eligible for approval' });
    }

    if (!directlyApprovableTags.includes(application.tag)) {
      return res.status(400).json({ error: 'This application must be forwarded to super admin' });
    }

    application.status = 'approvedByAdmin';
    await application.save();

    res.status(200).json({ message: 'Application approved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to approve application' });
  }
};

// Reject an application
exports.rejectApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;
    // const hostelNo = req.admin.hostelNo;
    const hostelNo = 5;


    const application = await Application.findOne({
      where: {
        applicationId,
        forwardedTo: hostelNo,
        status: 'pendingAtAdmin'
      }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found or not eligible for rejection' });
    }

    application.status = 'rejectedByAdmin';
    await application.save();

    res.status(200).json({ message: 'Application rejected successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to reject application' });
  }
};

// Forward an application to super admin
exports.forwardApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;
    // const hostelNo = req.admin.hostelNo;
    const hostelNo = 5;

    const application = await Application.findOne({
      where: {
        applicationId,
        forwardedTo: hostelNo,
        status: 'pendingAtAdmin'
      }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found or not eligible for forwarding' });
    }

    if (directlyApprovableTags.includes(application.tag)) {
      return res.status(400).json({ error: 'This application should be approved directly' });
    }

    application.status = 'pendingAtSuperAdmin';
    await application.save();

    res.status(200).json({ message: 'Application forwarded to super admin successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to forward application' });
  }
};

// Get single application by ID
exports.getApplicationById = async (req, res) => {
  try {
    const applicationId = req.params.id;
    // const hostelNo = req.admin.hostelNo;
    const hostelNo = 5


    const application = await Application.findOne({
      where: {
        applicationId,
        forwardedTo: hostelNo
      },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found or not accessible to you' });
    }

    res.status(200).json({ application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
};

exports.editApplication = async (req, res) => {
    try {
      const { applicationId } = req.params;
      const { tag, hostelChangeTo } = req.body;
  
      const application = await Application.findOne({
        where: {
          applicationId,
          forwardedTo: req.admin.hostelNo,
          status: 'pendingAtAdmin'
        }
      });
  
      if (!application) {
        return res.status(404).json({ error: 'Application not found or not accessible' });
      }
  
      // Only allow edit for specific tag
      if (tag === 'hostelChange') {
        application.hostelChangeTo = hostelChangeTo;
        await application.save();
        return res.status(200).json({ message: 'Application updated successfully', application });
      }
  
      return res.status(400).json({ error: 'Editing not allowed for this tag' });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update application' });
    }
};

exports.raiseBulkHostelChangeByAdmin = async (req, res) => {
  try {
    const { subject:title, description,tag, extraData } = req.body;
    const createdBy = req.body.tokenHostelNo;
    const createdByRole = "Hostel-Authority";
    const hostelNo = extraData.hostelNo;
    const rollNos = extraData.rollNos;
    if (!title || !description || !hostelNo || !Array.isArray(rollNos) || rollNos.length === 0) {
      return res.status(400).json({ error: "Missing required fields or invalid rollNos" });
    }

    const newApplication = await Application.create({
      title,
      description,
      tag,
      status: "pendingAtSuperAdmin",
      createdBy,
      createdByRole,
      toAdminId: null,
      forwardedTo: createdBy,
      extraData: {
        hostelNo,  // New hostel to transfer to
        rollNos    // Array of roll numbers to be transferred
      },
      allowAdminEdit: false
    });

    return res.status(201).json({
      success: true,
      message: "Bulk hostel transfer application raised successfully",
      applicationId: newApplication.applicationId,
      data: newApplication
    });
  } catch (error) {
    console.error("Error raising bulk application:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message
    });
  }
};
