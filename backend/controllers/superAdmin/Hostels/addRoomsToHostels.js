const db = require('../../../models/index')



const addRoomsToHostels = async (req, res) => {

    // const { roomNo, block, floorNo, currentQccupancy, maxOccupancy,
    //     lastUpdatedBy, hostelNo, roomTypeNo } = req.body;


    try {

        const jsonRooms = req.body;
        // console.log(jsonRooms);
        const allRoomsData = await db.rooms.findAll();


        let updateRoomData = []
        let inputRoomData = []



        jsonRooms.forEach((item, index) => {
            const roomExists = allRoomsData.some((room) => {
                return room.hostelNo === item.hostelNo && room.roomNo === item.roomNo
            })
            if (roomExists) {
                updateRoomData.push(item)
            } else {
                inputRoomData.push(item)
            }
        })


        try {

            // start the transaction
            const transaction = await db.sequelize.transaction();

            try {

                const roomsData = await db.rooms.bulkCreate(inputRoomData.map((data, index) => ({

                    roomNo: data.roomNo,
                    block: data.block,
                    floorNo: data.floorNo,
                    currentOccupancy: 'vacant',
                    maxOccupancy: data.maxOccupancy,
                    lastUpdatedBy: data.lastUpdatedBy,
                    hostelNo: data.hostelNo,
                    roomTypeNo: data.roomTypeNo

                })), { transaction, validate: true })

                console.log(roomsData);
                // await db.rooms.bulkCreate(roomsData)
                await transaction.commit();


                res.status(200).json('Rooms Inserted successfully')

            } catch (error) {
                await transaction.rollback();
                console.log("Error in transaction: " + error);
                throw error;
            }


        } catch (error) {

            res.status(400).json(error.message)
        }

    } catch (error) {
        res.status(500).json('Internal Server Error')
    }


}


module.exports = addRoomsToHostels