const db = require("../../../models/index")


const bulkRoomAllotmentToStudent = async (req, res) => {

    try {

        const JsonData = req.body

        const mappingData = await db.roomsStudentMapping.findAll();
        const studentData = await db.students.findAll();



    } catch (error) {
        res.status(500).json('Internal Server Error')
    }

}

module.exports = bulkRoomAllotmentToStudent;