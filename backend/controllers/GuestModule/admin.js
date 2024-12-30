const { guestInfo ,bookingInfo,guestRoomInfo} = require("../../models");
// get all the pending request at admin level
 const getPendingApplicationAdmin = async (req, res) => {
    try {
      const hostelNo = req.body.tokenHostelNo;
      const role = req.body.TokenRole;
      console.log(hostelNo);
      console.log(role);
      if(role !== "Hostel-Authority"){
        return res.status(403).json({
          success: false,
          message: "You are not authorized to perform this request.",
        });
      }
      if (!hostelNo) {
        return res.status(400).json({
          success: false,
          message: "hostel no is required.",
        });
      }
  
      const result = await guestInfo.findAll({
        where: {
            hostel_no:hostelNo,
          status: "pendingAtAdmin", // Filtering applications with 'pending' status
        },
      });
  
      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No pending applications found.",
        });
      }
      return res.status(200).json({ success: true, result });
    } catch (error) {
      console.error("Error fetching applications:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  };
// get all the application which are approved by admin
  const getApprovedApplicationAdmin = async (req, res) => {
    try {
      const hostelNo = req.body.tokenHostelNo;
      const role = req.body.TokenRole;
      console.log(hostelNo);
      console.log(role);
      if(role !== "Hostel-Authority"){
        return res.status(403).json({
          success: false,
          message: "You are not authorized to perform this request.",
        });
      }
      if (!hostelNo) {
        return res.status(400).json({
          success: false,
          message: "hostel no is required.",
        });
      }
  
      const result = await guestInfo.findAll({
        where: {
            hostel_no:hostelNo,
          status: "approvedByAdmin", // Filtering applications with 'pending' status
        },
      });
  
      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No approved applications found.",
        });
      }
      return res.status(200).json({ success: true, result });
    } catch (error) {
      console.error("Error fetching applications:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  };
// to accept or to approve the guest application
  const acceptApplicationAdmin = async (req, res) => {
    try {
        const hostelNo = req.body.tokenHostelNo;
        const { application_id } = req.params;
        const role = req.body.TokenRole;

        if (role !== "Hostel-Authority") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to perform this request.",
            });
        }

        if (!application_id || !hostelNo) {
            return res.status(400).json({
                success: false,
                message: "Application ID and hostel no. are required.",
            });
        }

        const application = await guestInfo.findOne({
            where: { application_id, status: "pendingAtAdmin" },
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found.",
            });
        }

        const adminHostelNo = application.hostel_no;
        if (adminHostelNo !== hostelNo) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to accept this application.",
            });
        }

        // Update the application status to "approvedByAdmin"
        await guestInfo.update(
          { status: "approvedByAdmin" },
          { where: { application_id } }
      );
        return res.status(200).json({
            success: true,
            message: "Application successfully accepted by admin.",
        });

    } catch (error) {
        console.error("Error accepting application:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
 };
// to reject the guest application
  const rejectApplicationAdmin = async (req, res) => {
    try {
      const hostelNo = req.body.tokenHostelNo;
      const { application_id } = req.params;
      const role = req.body.TokenRole;
      if(role !== "Hostel-Authority"){
        return res.status(403).json({
          success: false,
          message: "You are not authorized to perform this request.",
        });
      }
  
      if (!application_id || !hostelNo) {
        return res.status(400).json({
          success: false,
          message: "Application ID and hostel no. are required.",
        });
      }
  
      const application = await guestInfo.findOne({
        where: { application_id ,status:"pendingAtAdmin"},
      });
  
      if (!application) {
        return res.status(404).json({
          success: false,
          message: "Application not found.",
        });
      }
      const adminHostelNo = application.hostel_no;
      if (adminHostelNo !== hostelNo) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to reject this application.",
        });
      }
  
      await guestInfo.update(
        { status: "rejectedByAdmin" },
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
// to book room only work when the admin first approve the application
  const bookRoomAdmin = async (req, res) => {
    try {
        const {roomNo, block, floorNo, hostelNo } = req.body;
        const { application_id } = req.params;
        const TokenRole = req.body.TokenRole;
        const TokenHostelNo = req.body.tokenHostelNo;

        if (TokenRole !== "Hostel-Authority") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to perform this request.",
            });
        }

        if (!application_id || !roomNo || !block || !floorNo || !hostelNo) {
            return res.status(400).json({
                success: false,
                message: "All required fields (application ID, hostel no., and room details) must be provided.",
            });
        }

        const application = await guestInfo.findOne({
            where: { application_id, status: "approvedByAdmin" },
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found or not approved by admin.",
            });
        }

        if (application.hostel_no !== TokenHostelNo) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to accept this application.",
            });
        }
        const room = await guestRoomInfo.findOne({
            where: { roomNo, block, floorNo, hostelNo },
        });
        console.log("room details");
        console.log(room);
        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found or not available.",
            });
        }

        await bookingInfo.create({
            application_id: application_id,
            roomId: room.roomId,
            allocatedHostel:hostelNo
        });

        return res.status(200).json({
            success: true,
            message: "Room allocated and stored in booking info.",
        });
    } catch (error) {
        console.error("Error during room allocation:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
// to get the schedule of guest house
  const getSchedule = async (req, res) => {
  try {
    const hostelNo = req.body.tokenHostelNo;
    const role = req.body.TokenRole;
    if(role !== "Hostel-Authority"){
      return res.status(403).json({
        success: false,
        message: "You are not authorized to perform this request.",
      });
    }
    if (!hostelNo) {
      return res.status(400).json({
        success: false,
        message: "hostel no is required.",
      });
    }

    const result = await bookingInfo.findAll({
      where: {
          allocatedHostel:hostelNo,
      },
    });

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No pending applications found.",
      });
    }
    return res.status(200).json({ success: true, result });
    } catch (error) {
    console.error("Error fetching applications:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
  };
// get all the details of a guest with application id and room id
  const getDetails = async (req, res) => {
    try {
      const hostelNo = req.body.tokenHostelNo;
      const role = req.body.TokenRole;
      const { application_id, roomId } = req.params;
  
      if (role !== "Hostel-Authority") {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to perform this request.",
        });
      }
  

      if (!hostelNo) {
        return res.status(400).json({
          success: false,
          message: "Hostel number is required.",
        });
      }
      if (!application_id || !roomId) {
        return res.status(400).json({
          success: false,
          message: "Application ID and Room ID are required.",
        });
      }
  
      // Fetch guest info by application_id
      const guestData = await guestInfo.findOne({
        where: { application_id},
      });
  
      if (!guestData) {
        return res.status(404).json({
          success: false,
          message: "No data found for the provided Application ID.",
        });
      }
  
      // Fetch guest room info by room_id
      const roomData = await guestRoomInfo.findOne({
        where: { roomId},
      });
  
      if (!roomData) {
        return res.status(404).json({
          success: false,
          message: "No data found for the provided Room ID.",
        });
      }
  
      // Combine results
      const result = {
        guestInfo: guestData,
        roomInfo: roomData,
      };
  
      // Respond with the combined result
      return res.status(200).json({ success: true, result });
    } catch (error) {
      console.error("Error fetching details:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  };
  
module.exports = {getPendingApplicationAdmin,acceptApplicationAdmin,rejectApplicationAdmin,getApprovedApplicationAdmin,bookRoomAdmin,getSchedule,getDetails};

