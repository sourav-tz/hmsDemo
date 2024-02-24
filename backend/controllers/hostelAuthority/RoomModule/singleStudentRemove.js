const db = require('../../../models/index')

const singleStudentRemove = async (req, res) => {
    const { roomNo, rollNo, hostelNo, comment } = req.body

    const studentData = await db.students.findOne({
        where: { rollNo: rollNo }
    })

    const roomData = await db.rooms.findOne({
        where: { roomNo: roomNo, hostelNo: hostelNo }
    })
    const roomId = roomData.roomId;

    const mappedRoom = await db.roomsStudentMapping.count({
        where: { roomId: roomId }
    })

    const isExistMapping = await db.roomsStudentMapping.findOne({
        where: { roomId: roomId, rollNo: rollNo }
    })

    // this never be executed
    if (!isExistMapping) return res.status(401).json({ message: 'No Allocation is Found!' })

    try {
        // start the transaction
        const transaction = await db.sequelize.transaction();

        try {

            await db.students.update({ roomId: null, hostelNo: null }, {
                where: { rollNo: rollNo }
                , transaction: transaction, validate: true
            })


            if (roomData.currentOccupancy === 'Fully-Filled' || mappedRoom > 1) {
                await db.rooms.update({ currentOccupancy: 'Partially-Filled' }, {
                    where: { roomId: roomId }
                    , transaction: transaction, validate: true
                })
            } else {
                await db.rooms.update({ currentOccupancy: 'vacant' }, {
                    where: { roomId: roomId }
                    , transaction: transaction, validate: true
                })
            }

            await db.roomsStudentMapping.update({ comment: comment }, {
                where: { roomId: roomId }
                , transaction: transaction, validate: true
            })

            await db.roomsStudentMapping.destroy({
                where: { roomId: roomId }
            })

            await transaction.commit();

            res.status(200).json({ success: true, message: 'Student removed from room successfully' })

        } catch (error) {
            await transaction.rollback();
            console.log("Error in transaction: " + error);
            throw error;
        }

    } catch (error) {
        return res.status(400).json({ error: error });
    }

}

module.exports = singleStudentRemove 