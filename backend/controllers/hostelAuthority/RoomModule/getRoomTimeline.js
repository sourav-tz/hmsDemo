const db = require('../../../models/index')

const getRoomTimeline = async(req,res) => {

    try {
        const roomId = req.query.roomId

        
        const roomData = await db.roomsStudentMappings.findAll({
            where:{roomId: roomId},
            paranoid:false,
            include:[{
                model : db.students,
              }
            ]
        })
        console.log('roomData',roomData);
        res.status(200).json({success:true,roomData:roomData})

    } catch (error) {
        console.log("error in getRoomTimeline",error);
        res.status(500).json({message: error.message});
    }
}

module.exports = getRoomTimeline