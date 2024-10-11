const db = require('../../../models/index')
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
// Function to handle adding a notice
const addnotice = async (req, res) => {
    try {
        const { title,hostelNo } = req.body;
        const file = req.file;
        
        // Check if a file was uploaded
        if (!file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
          // Construct the public URL for the uploaded file
        const fileUrl = `${req.protocol}://${req.get('host')}/public/uploads/${file.filename}`; // Use filename instead of file.path
        // Save the notice to the database
        const newNotice = await db.notices.create({
            title: title,
            url: fileUrl,
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
        const public_id=req.body.public_id;

        // Fetch the notice from the database
        const notice = await db.notices.findByPk(public_id);
        if (!notice) {
            return res.status(404).json({ success: false, message: 'Notice not found' });
        }

        // Extract the file path from the URL (e.g., 'http://localhost:3000/public/uploads/file.pdf')
        const fileUrl = notice.url;
        const fileName = path.basename(fileUrl);  // Extracts 'file.pdf' from the full URL
        const filePath = path.join(__dirname,'../../../', 'public', 'uploads', fileName);  // Construct full path to the file on server
        console.log(filePath); // Print
        
        // Check if the file exists
        if (fs.existsSync(filePath)) {
            // Delete the file
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Failed to delete file:', err);
                    return res.status(500).json({ success: false, message: 'Failed to delete file' });
                }

                console.log('File deleted successfully:', filePath);
            });
        }

        // Delete the notice from the database
        await db.notices.destroy({ where: {public_id} });

        return res.status(200).json({ success: true, message: 'Notice and file deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Failed to delete notice' });
    }
};


  module.exports={
    addnotice,getNotices,deleteNotices
}