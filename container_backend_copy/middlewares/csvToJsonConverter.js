const csv=require('csvtojson')
const fs=require('fs');

exports.csvToJsonConverter = async (req,res,next)=>{
    
try {
  csv({checkType:true, skipEmptyLines: false ,nullObject: true })
   .fromFile(req.file.path)
   .then(async (jsonObj)=>{
    try {
       fs.unlink(req.file.path,(err)=>{
        if (err){
          console.log("error occured : "+err);
          return;
        }
        console.log("file deleted successfully");
       })
       // Iterate through each object in the array and convert empty strings to null
       jsonObj.forEach(obj => {
        Object.keys(obj).forEach(key => {
            if (obj[key] === '') {
                obj[key] = null;
            }
        });
    });
      req.body.data=jsonObj;
      next();
     }catch (error){
        return res.status(400).json({success:false,error:error});
    }
   })
  } catch (error) {
  return res.status(500).json({success:false,error:error});
}
};