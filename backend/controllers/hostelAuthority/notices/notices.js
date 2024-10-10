const db = require('../../../models/index')
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Function to handle adding a notice
const addnotice = async (req, res) => {
    try {
        const { title,hostelNo } = req.body;
        const file = req.file;
        
        // Check if a file was uploaded
        if (!file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        // Save the notice to the database
        const newNotice = await db.notices.create({
            title: title,
            url: file.path,
            public_id:uuidv4(),
            hostelNo: hostelNo
        });

        // Remove the file from the local storage

        // Return a successful response
        return res.status(200).json({
            success: true,
            message: 'Notice uploaded successfully',
            data: newNotice,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to upload notice',
        });
    }
};

const getNotices=async (req, res) => {
    try {
      let {hostelNo}=req.query;
      if(hostelNo==undefined)hostelNo=null;
        console.log(hostelNo);

      const result = await db.notices.findAll({
        where: { hostelNo },
        attributes: ['title', 'url','public_id','createdAt']
    });
    return res.status(200).json({
        success: true,
        result:result,
    });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get notices',
        });
    }
};

const deleteNotices=async (req, res) => {
    try {
        const public_id=req.body.noticeId;
        if (!public_id) {
            return res.status(400).json({
                success: false,
                message: 'Notice ID is required',
            });
        }
        const notice = await db.notices.findOne({ where: { public_id} });

        if (!notice) {
            return res.status(404).json({
                success: false,
                message: 'Notice not found',
            });
        }
        
        // Delete the notice from the database
        fs.unlinkSync(notice.url);
        await db.notices.destroy({
            where: { public_id },
        });

        return res.status(200).json({
            success: true,
            message: 'Deleted successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete notice',
        });
    }
};


  module.exports={
    addnotice,getNotices,deleteNotices
}