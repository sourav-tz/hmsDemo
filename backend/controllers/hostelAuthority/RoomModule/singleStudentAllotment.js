const db = require("../../../models");

// steps for single room allocation 
// step1: check whether the student exists in database or not , if doesnot exist we send bad status code 404
// step2: if student does exists , so we further check whether he/she does not belongs to any room, if he/she already belongs to any room, so we again 
//          bad status code 404
// step3:  now we check whether the roomNo is exists in the hostel or not
// step4: this is the imp step, here we check how many students already living in the room 
// step5: if all the above conditions are true for the allotment, so we allot the room to the student
// step6: all the subsequent models are also updated according to the status

const singleStudentAllot = async (req, res) => {

    try {

        const { rollNo, roomNo, hostelNo } = req.body;

        const isStudentExists = await db.students.findOne({
            where: { rollNo: rollNo }
        })

        if (!isStudentExists) return res.status(404).json({ message: `Student Doesn't exist` });


        if (isStudentExists.roomId !== null) return res.status(404).json({ message: `Student is already in some room` });

        const roomData = await db.rooms.findOne({
            where: { roomNo: roomNo, hostelNo: hostelNo },
        })


        if (!roomData) return res.status(404).json({ message: `Room does not exist`, roomData: roomData });

        const roomId = roomData.roomId;

        const mappedRoom = await db.roomsStudentMappings.count({
            where: { roomId: roomId }
        })

        if (mappedRoom.toString() === roomData.maxOccupancy) return res.status(401).json({ message: 'Room is Fully Filled' })


        try {
            // start the transaction
            const transaction = await db.sequelize.transaction();

            try {

                const roomAlloted = await db.roomsStudentMappings.create({
                    roomId: roomId,
                    rollNo: rollNo,
                    hostelNo: hostelNo,
                    comment: "Room Alloted Successfully",
                    lastUpdatedBy: 'Adii'
                }, { transaction: transaction, validate: true })

                await db.students.update({ roomId: roomId, hostelNo: hostelNo }, {
                    where: { rollNo: rollNo }
                    , transaction: transaction, validate: true
                })

                if (roomData.currentOccupancy === 'vacant' || mappedRoom < roomData.maxOccupancy - 1) {
                    await db.rooms.update({ currentOccupancy: 'Partially-Filled' }, {
                        where: { roomId: roomId }
                        , transaction: transaction, validate: true
                    })
                } else {
                    await db.rooms.update({ currentOccupancy: 'Fully-Filled' }, {
                        where: { roomId: roomId }
                        , transaction: transaction, validate: true
                    })
                }

                await transaction.commit();

                return res.status(200).json({
                    success: true,
                    roomAlloted: roomAlloted
                });

            } catch (error) {

                await transaction.rollback();
                console.log("Error in transaction: " + error);
                throw error;
            }
        } catch (error) {

            return res.status(400).json({ error: error.parent.sqlMessage });
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = singleStudentAllot;