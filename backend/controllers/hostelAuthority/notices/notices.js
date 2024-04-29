const db = require('../../../models/index')
const cloudinary=require("cloudinary");
const getDataUri=require("../../../utils/datauri");
const addnotice=async (req, res) => {
    try {
        const {title}=req.body;
        const hostelNo=req.body.tokenHostelNo;
        const file=req.file;
        const fileUri=getDataUri(file);
      
        // const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);
         // Upload file to Cloudinary
         const mycloud = await cloudinary.v2.uploader.upload(fileUri.content, {
            resource_type: 'raw',
        });
        if (!mycloud || !mycloud.secure_url) {
            return res.status(500).json({
                success: false,
                message: 'Failed to upload notice. Invalid Cloudinary response.',
            });
        }
        const newNotice = await db.notices.create({
            title:title,
            url:mycloud.secure_url,
            public_id:mycloud.public_id,
            hostelNo
        });
        return res.status(200).json({
            success: true,
            message: 'notice uploaded successfully',
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
      let hostelNo=req.body.tokenHostelNo;
      if(hostelNo==undefined)hostelNo=null;
      const result = await db.notices.findAll({
        where: { hostelNo },
        attributes: ["noticeId",'title', 'url','public_id','createdAt']
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
        const {noticeId}=req.body;
        await db.notices.destroy({
            where:{noticeId},
          });
          return res.status(200).json({
            success: true,
            message: 'deleted Successfully',
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