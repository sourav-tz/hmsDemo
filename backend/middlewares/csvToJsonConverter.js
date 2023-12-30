const csv=require('csvtojson')
const fs=require('fs');

exports.csvToJsonConverter = async (req,res,next)=>{
    
try {
  csv({checkType:true,ignoreEmpty:true})
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
      req.body=jsonObj;
      next();
     }catch (error){
        return res.status(400).send(error);
    }
   })
  } catch (error) {
  
}
};