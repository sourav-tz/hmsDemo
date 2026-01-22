const db = require('../../../models');
const { students, profiles, bankdetails, roomsStudentMappings, studentRemarks, studentArchive } = db;

const addStudentToArchive = async (req, res) => {
    try {
        // Extract rollNo from the request body
        const { rollNo } = req.body;

        // Check if rollNo is provided in the request body
        if (!rollNo) {
            return res.status(400).json({ message: 'Roll number is required' });
        }
           // ✅ Check if student is already archived
           const existingArchive = await studentArchive.findOne({ where: { rollNo } });
           if (existingArchive) {
               return res.status(409).json({
                   message: `Student with roll number ${rollNo} is already archived.`,
               });
           }

        // Fetch student data from related tables based on rollNo
        const studentData = await students.findOne({
            where: { rollNo },
            include: [
                { model: profiles, required: true },  // Including profiles table
                { model: roomsStudentMappings, required: false },  // Including room/student mappings table
                { model: bankdetails, required: false },  // Including bank details
                { model: studentRemarks, required: false },  // Including remarks table
            ]
        });

        // Check if student data exists
        if (!studentData) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Ensure related profile data exists
        const profileData = studentData.profile;
        if (!profileData) {
            return res.status(500).json({ message: 'Profile data missing for the student' });
        }

        // Prepare roomMappings as an array of objects
        const roomMappingsArray = studentData.roomsStudentMappings.map(mapping => ({
            roomId: mapping.roomId,
            hostelNo: mapping.hostelNo,
            comment: mapping.comment,
            checkOutDate: mapping.checkOutDate || null,  // Handle null or undefined checkOutDate
        }));

        // Prepare remarks as an array of objects
        const studentRemarksArray = studentData.studentRemarks.map(remark => ({
            remarkId: remark.remarkId,
            remarks: remark.remarks,
            fileAttachment: remark.fileAttachment || null,  // Handle missing file attachment
            createdAt: remark.createdAt,
        }));

        // Prepare student archive data
        const studentArchiveData = {
            rollNo: studentData.rollNo,
            firstName: studentData.firstName || null,  // Handle missing fields
            lastName: studentData.lastName || null,
            year: studentData.year || null,
            email: studentData.email || null,
            bloodGroup: profileData.bloodGroup || null,
            identificationMark: profileData.identificationMark || null,
            gender: profileData.gender || null,
            pEmail: profileData.pEmail || null,
            subAddress: profileData.subAddress || null,
            city: profileData.city || null,
            state: profileData.state || null,
            pinCode: profileData.pinCode || null,
            contactNumber: profileData.contactNumber || null,
            secondaryContact: profileData.secondaryContact || null,
            fatherName: profileData.fatherName || null,
            fatherContact: profileData.fatherContact || null,
            fatherOccupation: profileData.fatherOccupation || null,
            motherName: profileData.motherName || null,
            motherContact: profileData.motherContact || null,
            motherOccupation: profileData.motherOccupation || null,
            dob: profileData.dob || null,
            addharNumber: profileData.addharNumber || null,
            photoLink: profileData.photoLink || null,
            accHolderName: studentData.bankdetail ? studentData.bankdetail.accHolderName : null,
            bankName: studentData.bankdetail ? studentData.bankdetail.bankName : null,
            accNumber: studentData.bankdetail ? studentData.bankdetail.accNumber : null,
            IFSC: studentData.bankdetail ? studentData.bankdetail.IFSC : null,
            courseId: studentData.courseId || null,
            referrals: studentData.referrals || null,  // Handle missing field
            remarks: studentRemarksArray,  // Storing all remarks as JSON
            roomMappings: roomMappingsArray,  // Storing room mappings as an array of objects
        };

        // Create a new student archive record in the database
        const newArchive = await studentArchive.create(studentArchiveData);

        // If archive creation is successful, send a response with the archived data
        return res.status(200).json({
            message: 'Student archived successfully',
            data: newArchive,
        });
    } catch (error) {
        // Catch any unexpected errors and log them for debugging
        console.error('Error archiving student data:', error);

        // Send a generic error response to the client
        return res.status(500).json({
            message: 'Error archiving student data',
            error: error.message || 'An unexpected error occurred',
        });
    }
};

// View a specific archived student by roll number
const getStudentArchiveByRollNo = async (req, res) => {
    try {
        const rollNo = req.params.rollNo;

        if (!rollNo) {
            return res.status(400).json({ message: "Roll number is required" });
        }

        const archiveData = await studentArchive.findOne({ where: { rollNo } });

        if (!archiveData) {
            return res.status(404).json({ message: "Archived student not found" });
        }

        return res.status(200).json({ message: "Student archive found", data: archiveData });
    } catch (error) {
        console.error("Error fetching archived student:", error);
        return res.status(500).json({ message: "Error fetching archived student", error });
    }
};

// View all archived students
const getAllStudentArchives = async (req, res) => {
    try {
        const archives = await studentArchive.findAll();

        return res.status(200).json({
            message: "All archived students fetched successfully",
            data: archives,
        });
    } catch (error) {
        console.error("Error fetching all archives:", error);
        return res.status(500).json({ message: "Error fetching all archives", error });
    }
};


module.exports = {
    addStudentToArchive,
    getStudentArchiveByRollNo,
    getAllStudentArchives,
};
