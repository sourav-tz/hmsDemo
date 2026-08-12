const db = require('../../models/index')
const { enrichComplaintsWithPriority } = require('../../services/complaintPriority.service');
const { Op } = require('sequelize');
const raiseComplaint=async (req, res) => {
    try {
        // Extract necessary information from the request body
        const {subject, tag,rollNo,description,hostelNo} = req.body;
        if(hostelNo==null){
            return res.status(400).json({
                success: false,
                message: 'Hostel No is required',
            });
        }


        // Create a new complaint
        const newComplaint = await db.complaints.create({
            subject,
            tag,
            description,
            status:"pending",
            rollNo, 
            hostelNo, 
        });

        // Return the newly created complaint
        return res.status(200).json({
            success: true,
            message: 'Complaint raised successfully',
            data: newComplaint,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to raise complaint',
        });
    }
};
const getComplaints=async (req, res) => {
    try {
      const {rollNo}=req.body;
      const result= await db.complaints.findAll({
        where:{
            rollNo
        }
      });
      console.log(result);
      return res.status(200).json({success:true, result:result});
    } catch (error) {
      console.error(error);
      return res.status(500).json({success:false, error: error });
    }
  };
  //Key 
const getComplaintsAdmin=async (req, res) => {
    try {
      const hostelNo=req.body.tokenHostelNo;
      const resolvedB=req.query.rescomp == "true";
      const rejectedB=req.query.rejcomp == "true";
      const statuses = ["pending"];  // Always include "pending" by default

// Add "resolved" if resolvedB is true
if (resolvedB) {
  statuses.push("resolved");
}

// Add "rejected" if rejectedB is true
if (rejectedB) {
  statuses.push("rejected");
}

const result = await db.complaints.findAll({
  where: {
    hostelNo,
    status: {
      [Op.in]: statuses
    }
  }
});
console.log("Complaints fetched:", result.length);

// Fetch room numbers for each unique rollNo
const rollNos = [...new Set(result.map(c => c.rollNo))];
const roomMappings = await db.roomsStudentMappings.findAll({
  where: { rollNo: { [Op.in]: rollNos } },
  include: [{ model: db.rooms, attributes: ['roomNo', 'block'] }],
  attributes: ['rollNo', 'roomId'],
});

// Build a map of rollNo -> roomNo
const rollNoToRoom = {};
roomMappings.forEach(m => {
  if (!rollNoToRoom[m.rollNo] && m.room) {
    rollNoToRoom[m.rollNo] = m.room.roomNo;
  }
});

// Inject roomNo into dataValues so enrichComplaintsWithPriority can read it
result.forEach(c => {
  c.dataValues.student = { room: { roomNo: rollNoToRoom[c.rollNo] ?? null } };
});

const enrichedResult = enrichComplaintsWithPriority(result);

const priorityOrder = {
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3
};

enrichedResult.sort((a, b) => {
  return priorityOrder[a.priority] - priorityOrder[b.priority];
});

console.log("Complaints enriched");
      return res.status(200).json({success:true, result:enrichedResult});
    } catch (error) {
      console.error(error);
      return res.status(500).json({success:false, error: error });
    }
  };
const resoleComplaint=async (req, res) => {
    try {
      const {complaintId , comment}=req.body;
      await db.complaints.update({status:"resolved",comment : comment},{
        where:{
            complaintId
        }
      });
      return res.status(200).json({success:true, message:"successfully resolved"});
    } catch (error) {
      console.error(error);
      return res.status(500).json({success:false, error: error });
    }
  };
const rejectComplaint=async (req, res) => {
    try {
      const {complaintId, comment}=req.body;
      await db.complaints.update({status:"rejected",comment : comment},{
        where:{
            complaintId
        }
      });
      return res.status(200).json({success:true, message:"successfully rejected"});
    } catch (error) {
      console.error(error);
      return res.status(500).json({success:false, error: error });
    }
  };

  module.exports={
    raiseComplaint,getComplaints,getComplaintsAdmin,resoleComplaint,rejectComplaint
  }