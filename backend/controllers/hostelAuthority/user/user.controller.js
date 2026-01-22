const db = require('../../../models');
const bcrypt = require('bcrypt');



const updatePassword = async (req, res) =>{
    try {

        const transaction = await db.sequelize.transaction();

        try{
            const {oldPassword, newPassword} = req.body;
            const token = req.cookies.hostelAccessToken;

            if(!token) return res.status(401).json({error: "Unauthorized"});
            
            const {email} = jwt.verify(token, process.env.JWT_SECRET_KEY);
            
            const user = await db.users.findOne({where: {email}});
            
            if(!user) 
                return res.status(404).json({error: "User not found"});

            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if(!isMatch) 
                return res.status(401).json({error: "Invalid Password"});
            
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            
            await db.users.update({password: hashedPassword}, {where: {email}});
            await transaction.commit();
            
            res.status(200).json({message: "Password updated successfully"});
        }catch(error){
            await transaction.rollback();
            throw error;
        }

    }catch(error){
        res.status(400).json({error: error.message});
    }
}


module.exports = updatePassword;