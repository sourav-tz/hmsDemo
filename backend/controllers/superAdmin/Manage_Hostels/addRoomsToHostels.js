const db = require('../../../models/index')

function validateJsonData(jsonData, requiredAttributes) {
    const item = jsonData[0];
    const jsonKeys = Object.keys(item);
    const attributeSet = new Set(requiredAttributes);
  
      // Check if the sizes of the sets are equal
      if (jsonKeys.length !== attributeSet.size) {
        throw new Error(`CSV did not match with given Template`);
        
      }
      
      // Check if all keys in jsonData are also in attributes
      for (const key of jsonKeys) {
        if (!attributeSet.has(key)) {
          throw new Error(`CSV did not match with given Template. wrong attribute is ${key}`);
          }
      }
  }

  function filterDuplicates(array) {
    const duplicates = [];
    const unique = array.filter((room) => {
      const isDuplicate = array.filter(
        (existingRoom) =>
          existingRoom.roomNo === room.roomNo && existingRoom.hostelNo === room.hostelNo && existingRoom.block === room.block
      ).length;
      if (isDuplicate>1) {
        duplicates.push({message:"Some Rooms are common with other entry in CSV",...room});
      }
      return isDuplicate <= 1;
    });
  
    return { duplicates, unique };
  }


  async function uploadRooms(data){

    try {

        // start the transaction
        const transaction = await db.sequelize.transaction();

        try {

            const roomsData = await db.rooms.create({

                roomNo: data.roomNo,
                block: data.block,
                floorNo: data.floorNo,
                currentOccupancy: 'vacant',
                maxOccupancy: data.maxOccupancy,
                lastUpdatedBy: 'req.body.email',
                hostelNo: data.hostelNo,

            }, { transaction, validate: true })

            // console.log(roomsData);
            // await db.rooms.bulkCreate(roomsData)
            await transaction.commit();


            return {message:'success', ...data}

        } catch (error) {
            await transaction.rollback();
            console.log("Error in transaction: " + error);
            throw error;
        }


    } catch (error) {
        return {message:error.message,...data}
    }
  }


const addRoomsToHostels = async (req, res) => {

    // const { roomNo, block, floorNo, currentQccupancy, maxOccupancy,
    //     lastUpdatedBy, hostelNo, roomTypeNo } = req.body;


    try {

        const jsonRooms = req.body.data;
        // console.log(jsonRooms);

        const requiredAttributes = ["roomNo","block","floorNo","maxOccupancy","hostelNo"];
        validateJsonData(jsonObj, requiredAttributes);
        const allRoomsData = await db.rooms.findAll();

        let finalWithErrors=[];
        let theseEnteredInDB=[];

        // remove duplicates from csv
        const { duplicates, unique } = filterDuplicates(jsonObj);
        finalWithErrors=[...duplicates];
        console.log(unique);

        let inputRoomData=[];
        // remove duplicates from db
        unique.forEach((item, index) => {
            const roomExists = allRoomsData.some((room) => {
                return room.hostelNo === item.hostelNo && room.roomNo === item.roomNo && room.block === item.block
            })
            if (roomExists) {
                finalWithErrors.push({message:"already Exists in database",...item})
            } else {
                inputRoomData.push(item)
            }
        })

        console.log(inputRoomData);

        try {
            const results = await Promise.all(
                inputRoomData.map((entry) => uploadRooms(entry))
              );

              results.forEach((result) => {
                if(result.message === 'success'){
                    theseEnteredInDB.push(result);
                }else{
                    finalWithErrors.push(result);
                }
              })

        } catch (error) {
            console.log('Error during upload:' , error.message);
        }
        return res.status(200).json([theseEnteredInDB,finalWithErrors]);

    } catch (error) {
        res.status(500).json(error.message)
    }

}


module.exports = addRoomsToHostels