const db = require('../../models/index')


exports.bulkCreateController = async (req, res) => {
    try {
        const jsonObj = req.body;
        
        const alldb= await db.students.findAll();
        // console.log(alldb);
        let insertPayload = [];
        let update = [];
    
        //?code to seperate insertpayload and update
        jsonObj.forEach((item, index) => {
          const exists = alldb.some((student) => {
            return student.rollNo == item.rollNo || student.email == item.email;
          });   
          if (exists) {
            update.push(item);
          } else {
            insertPayload.push(item);
          }
        });
        console.log(insertPayload);
        console.log(`update ${update}`);
        return res.send("success");
    } catch (err) {
        res.json(err + "");
    }

}
