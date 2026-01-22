exports.downloadFile=async (req,res)=>{
    try {
        const path=req.query.path;
        console.log(path);
        const filename=req.query.filename;
        return res.status(200).download(path,filename);
       
      } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
};