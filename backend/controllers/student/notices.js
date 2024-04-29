const db = require('../../models/index')
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


  module.exports={
    getNotices
}