const { Description } = require('@storybook/blocks');
const db = require('../../models/index')

const raiseComplaint=async (req, res) => {
    try {
        // Extract necessary information from the request body
        const {subject, tag,rollNo,description} = req.body;
        const hostelNo=req.body.tokenHostelNo

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
      return res.status(200).json({success:true, result:result});
    } catch (error) {
      console.error(error);
      return res.status(500).json({success:false, error: error });
    }
  };
const getComplaintsAdmin=async (req, res) => {
    try {
      const hostelNo=req.body.tokenHostelNo;
      const result= await db.complaints.findAll({
        where:{
            hostelNo,status:"pending"
        }
      });
      return res.status(200).json({success:true, result:result});
    } catch (error) {
      console.error(error);
      return res.status(500).json({success:false, error: error });
    }
  };
const resoleComplaint=async (req, res) => {
    try {
      const {complaintId}=req.body;
      await db.complaints.update({status:"resolved"},{
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
      const {complaintId}=req.body;
      await db.complaints.update({status:"rejected"},{
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