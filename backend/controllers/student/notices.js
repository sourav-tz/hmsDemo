const db = require('../../models/index')
const { Op } = require('sequelize');
// const getNotices = async (req, res) => {
//     try {
//         //   let hostelNo=req.body.tokenHostelNo;
//         console.log("BACKENDDD", req.query)
//         let { hostelNo } = req.query;
//         if (hostelNo == undefined) hostelNo = null;
//         const result = await db.notices.findAll({
//             where: { hostelNo },
//             attributes: ['title', 'url', 'public_id', 'createdAt', 'isGlobal']
//         });
//         return res.status(200).json({
//             success: true,
//             result: result,
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             message: 'Failed to get notices',
//         });
//     }
// };



// module.exports = {
//     getNotices
// }

const getNotices = async (req, res) => {
    try {
        let { hostelNo } = req.query;
        if (hostelNo === undefined) hostelNo = null;

        const result = await db.notices.findAll({
            where: {
                [Op.or]: [
                    { hostelNo: hostelNo },
                    { isGlobal: true }
                ]
            },
            attributes: ['title', 'url', 'details', 'public_id', 'createdAt', 'isGlobal']
        });

        return res.status(200).json({
            success: true,
            result: result,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get notices',
        });
    }
};

module.exports = {
    getNotices
}
