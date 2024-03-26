const db = require("../../../models/index")


const bulkRoomAllotmentToStudent = async (req, res) => {

    try {
        const studentsData = req.body; // Array of student data
        const allotments = [];

        for (const student of studentsData) {
            const { rollNo, roomNo, hostelNo } = student;

            const isStudentExists = await db.students.findOne({
                where: { rollNo: rollNo }
            });

            if (!isStudentExists) {
                allotments.push({ rollNo, message: `Student doesn't exist` });
                continue;
            }

            if (isStudentExists.roomId !== null) {
                allotments.push({ rollNo, message: `Student is already in some room` });
                continue;
            }

            const roomData = await db.rooms.findOne({
                where: { roomNo: roomNo, hostelNo: hostelNo },
            });

            if (!roomData) {
                allotments.push({ rollNo, message: `Room doesn't exist` });
                continue;
            }

            const roomId = roomData.roomId;

            const mappedRoom = await db.roomsStudentMapping.count({
                where: { roomId: roomId }
            });

            if (mappedRoom.toString() === roomData.maxOccupancy) {
                allotments.push({ rollNo, message: `Room is fully filled` });
                continue;
            }

            try {
                // Start the transaction
                const transaction = await db.sequelize.transaction();

                try {
                    const roomAlloted = await db.roomsStudentMapping.create({
                        roomId: roomId,
                        rollNo: rollNo,
                        hostelNo: hostelNo,
                        comment: "Room Alloted Successfully",
                        lastUpdatedBy: 'Adii'
                    }, { transaction: transaction, validate: true });

                    await db.students.update({ roomId: roomId, hostelNo: hostelNo }, {
                        where: { rollNo: rollNo },
                        transaction: transaction, validate: true
                    });

                    if (roomData.currentOccupancy === 'vacant' || mappedRoom < roomData.maxOccupancy - 1) {
                        await db.rooms.update({ currentOccupancy: 'Partially-Filled' }, {
                            where: { roomId: roomId },
                            transaction: transaction, validate: true
                        });
                    } else {
                        await db.rooms.update({ currentOccupancy: 'Fully-Filled' }, {
                            where: { roomId: roomId },
                            transaction: transaction, validate: true
                        });
                    }

                    await transaction.commit();

                    allotments.push({ rollNo, success: true, roomAlloted });
                } catch (error) {
                    await transaction.rollback();
                    console.log("Error in transaction: " + error);
                    allotments.push({ rollNo, error: error.toString() });
                }
            } catch (error) {
                allotments.push({ rollNo, error: error.parent.sqlMessage });
            }
        }

        return res.status(200).json({ allotments });
    } catch (error) {
        console.error("Error: " + error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = bulkRoomAllotmentToStudent;
