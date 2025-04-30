const { Application } = require('../../models'); // Assuming you have the Application model imported

// Function to create a new application
exports.createApplication = async (req, res) => {
  try {
    const { subject, description ,tag,hostelNo,rollNo,preferredHostel,allowAdminEdit} = req.body;
    const studentId = rollNo;
    const application = await Application.create({
      title : subject,
      description,
      tag,
      status: 'pendingAtAdmin',
      createdBy: studentId,
      createdByRole: 'student',
      forwardedTo : hostelNo,
      extraData:{
        hostelNo : preferredHostel
      },
      allowAdminEdit
    });

    res.status(201).json({
      message: 'Application created successfully',
      application
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create application' });
  }
};

// Function to get all applications by the student
exports.getApplications = async (req, res) => {
  try {
    console.log(req.body);
    const studentId = req.query.rollNo;
    console.log(studentId);
    // Find all applications created by the student
    const applications = await Application.findAll({
      where: { createdBy: studentId },
    });

    res.status(200).json({
      applications
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

// Function to get a specific application by ID
exports.getApplicationById = async (req, res) => {
  try {
    const applicationId = req.params.id;
    // not in use currently 
    const studentId = 523110024; // Assuming the student's roll number is in `req.user`

    // Find the specific application created by the student
    const application = await Application.findOne({
      where: {
        applicationId: applicationId,
        createdBy: studentId, // Ensure the student can only view their own application
      },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.status(200).json({
      application
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
};
