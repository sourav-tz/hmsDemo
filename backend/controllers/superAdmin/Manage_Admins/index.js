// const db = require('../../../models/index')

// //* manage admin [revoke login , give login again ,change hostel]
// //* provide all admins (get request for table)
// //*  login acess ke lie enable disable 
// //* change hostel (for now just update in HA table but we need to store transaction history)


// const getAdmins=async (req, res) => {
//   try {
//     const data = await db.users.findAll({
//       paranoid:false,
//       where:{
//         role:'Hostel-Authority'
//       },
//       include: [{
//           model: db.hostelauthoritys,
//       }]
//   });
//     const result=data.map((key)=>{
//       return ((key.dataValues.deletedAt)?{...(key.dataValues.hostelauthority.dataValues),active:false}:{...(key.dataValues.hostelauthority.dataValues),active:true})
//     });
//     return res.status(200).json(result);
//   } catch (error) {
//     return res.status(500).json({message:"Internal Server Error in getAdmins Controller"});
//   }
// }


// const revokeLoginAcess = async (req,res)=>{
//     try {
//         const {emailOfHA} = req.body;
//         const deleted=await db.users.destroy({
//             where:{email:emailOfHA}
//         });
//         if(!deleted){
//           return res.status(400).json({message:"Email not found or allready revoked access"});
//         }
//       return res.status(200).json({message:"Successfull revoked access"});
//       } catch (error) {
//         return res.status(500).json({message:"Internal Server Error in RevokeLoginAccess Controller"});
//       }
// }


// const giveLoginAccess = async (req,res)=>{
//     try {
//         const {emailOfHA} = req.body;
//         const enabled=await db.users.restore({
//             where:{email:emailOfHA}
//         });
//       if(!enabled){
//         return res.status(400).json({message:"Email not found or allread granted access"});
//       }
//       return res.status(200).json({message:"successfully granted login access"});
//       } catch (error) {
//         return res.status(500).json({message:"Internal Server Error in GiveLoginAccess Controller"});
//       }
// }



// const changeHostel=async (req,res)=>{
//     try {
//         const {emailOfHA,newHostelNo} = req.body;
//         const isHostelPresent=await db.hostels.findOne({
//           where:{
//             hostelNo:newHostelNo
//           }
//         });
//         if(!isHostelPresent) {
//           return res.status(400).json({message:"Given Hostel Not Found"});
//         }
//         await db.hostelauthoritys.update({hostelNo:newHostelNo},{
//             where:{email:emailOfHA}
//         });
//       return res.status(200).json({message:`Hostel changed to ${newHostelNo}`});
//       } catch (error) {
//         console.log(error);
//         return res.status(500).json({message:"Internal Server Error in ChangeHostel Controller"});
//       }
// }

// const deleteAdmin=async (req,res)=>{
//   try{
//     const {email}=req.body;
//     const deleted=await db.users.destroy({
//       where:{email:email},
//       force:true
//     });
//     const deletedHA=await db.hostelauthoritys.destroy({
//       where:{email:email},
//     });
//     if(!deleted && !deletedHA){
//       return res.status(400).json({message:"Email not found or allready deleted"});
//     }
//     return res.status(200).json({message:"Successfully deleted"});
//   }
//   catch(error){
//     return res.status(500).json({message:"Internal Server Error in DeleteAdmin Controller"});
//   }
// }


// module.exports={
//   getAdmins,revokeLoginAcess,giveLoginAccess,changeHostel,deleteAdmin
// }



const db = require('../../../models/index')

//* manage admin [revoke login , give login again ,change hostel]
//* provide all admins (get request for table)
//*  login acess ke lie enable disable 
//* change hostel (for now just update in HA table but we need to store transaction history)


const getAdmins=async (req, res) => {
  try {
    const data = await db.users.findAll({
      paranoid:false,
      where:{
        role:'Hostel-Authority'
      },
      include: [{
          model: db.hostelauthoritys,
          paranoid: false   // Include soft-deleted hostel authority records // ashutosh Dwivedi
      }]
  });
  const result = data.map((user) => {
    return {
      ...user.hostelauthority?.dataValues,
      active: user.isActive   // correct flag
    };
  });  
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({message:"Internal Server Error in getAdmins Controller"});
  }
}

//soft delete admin (set isActive to false) by ashutosh Dweivedi
const revokeLoginAcess = async (req, res) => {
  try {
    // 1. Request body se Hostel Authority ka email lo
    const { emailOfHA } = req.body;

    // 2. Admin ko delete karne ke bajay sirf login access revoke karo
    //    i.e. users table me isActive = false set karo
    const updated = await db.users.update(
      { isActive: false },              // 🔒 login disable
      {
        where: {
          email: emailOfHA,              // specific admin
          role: 'Hostel-Authority'       // safety check (sirf admin)
        }
      }
    );

    // 3. Agar koi row update nahi hui
    //    ya to email galat hai ya admin already inactive hai
    if (updated[0] === 0) {
      return res.status(400).json({
        message: "Email not found or already revoked access"
      });
    }

    // 4. Success response
    return res.status(200).json({
      message: "Successfully revoked login access"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error in RevokeLoginAccess Controller"
    });
  }
};


//reactivate admin by ashutosh Dweivedi
const giveLoginAccess = async (req, res) => {
  try {
    // Get Hostel Authority email from request body
    const { emailOfHA } = req.body;

    // Enable login access by setting isActive = true in users table
    const updated = await db.users.update(
      { isActive: true },
      {
        where: {
          email: emailOfHA,
          role: 'Hostel-Authority' // ensures only Hostel Authority accounts are updated
        }
      }
    );

    // If no rows were updated, either the email does not exist
    // or the account is already active
    if (updated[0] === 0) {
      return res.status(400).json({
        message: "Email not found or login access already granted"
      });
    }

    // Successful response
    return res.status(200).json({
      message: "Successfully granted login access"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error in GiveLoginAccess Controller"
    });
  }
};




const changeHostel=async (req,res)=>{
    try {
        const {emailOfHA,newHostelNo} = req.body;
        const isHostelPresent=await db.hostels.findOne({
          where:{
            hostelNo:newHostelNo
          }
        });
        if(!isHostelPresent) {
          return res.status(400).json({message:"Given Hostel Not Found"});
        }
        await db.hostelauthoritys.update({hostelNo:newHostelNo},{
            where:{email:emailOfHA}
        });
      return res.status(200).json({message:`Hostel changed to ${newHostelNo}`});
      } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error in ChangeHostel Controller"});
      }
}
//soft delete admin (set isActive to false) by ashutosh Dweivedi
const deleteAdmin = async (req, res) => {
  try {
    const { email } = req.body;

    const updated = await db.users.update(
      { isActive: false },
      {
        where: {
          email: email,
          role: 'Hostel-Authority'
        }
      }
    );

    if (updated[0] === 0) {
      return res.status(400).json({
        message: "Admin not found or already deactivated"
      });
    }

    return res.status(200).json({
      message: "Admin deactivated successfully"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error in DeleteAdmin Controller"
    });
  }
};



module.exports={
  getAdmins,revokeLoginAcess,giveLoginAccess,changeHostel,deleteAdmin
}