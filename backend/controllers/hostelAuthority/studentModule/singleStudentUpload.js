const db = require('../../../models/index')

const singleStudentUpload=async (req,res)=>{
    try {
          //? get json data from body
          const data = req.body;   
        const studentData = await db.students.findOne({
          where: { rollNo:data.rollNo}
        });
    
        //if student Already exists
        if (studentData) {
          return res.status(404).json({ error: 'Student allready exists' });
        }
        try {
            // Start the transaction
            const transaction = await db.sequelize.transaction();
          
            try {
              // Create users
              const password= data.contactNumber !== undefined ? String(data.contactNumber) : String(data.rollNo);
              const securePassword = await bcrypt.hash(password, salt)
              const usersData = {
                email: data.email,
                password:securePassword,
                role: 'Student',
              };
          
              const insertedUser = await db.users.create(usersData, { transaction, validate: true });
          
              // Insert students
              const insertedStudents = await db.students.create({
                rollNo: data.rollNo,
                firstName: data.firstName,
                lastName: data.lastName,
                year: data.year,
                email: insertedUser.email,
                courseId: data.courseId, // given using dropdown
              }, { transaction, validate: true });
          
              // Insert profiles
              const profilesData = {
                ...data,
                rollNo: insertedStudents.rollNo,
              };
          
              await db.profiles.create(profilesData, { transaction, validate: true });
          
              // Insert bankdetails
              const bankdetailsData = {
                rollNo: insertedStudents.rollNo,
                accHolderName: data.accHolderName,
                bankName: data.bankName,
                accNumber: data.accNumber,
                IFSC: data.IFSC,
              };
          
              await db.bankdetails.create(bankdetailsData, { transaction, validate: true });
          
              // Commit the transaction
              await transaction.commit();
          
              return res.json(data);
            } catch (error) {
              // Rollback the transaction on error
              await transaction.rollback();
              console.error("Error in transaction:", error);
              throw error; // Rethrow the error to handle it in the outer catch block
            }
          } catch (error) {
            console.log("Outer catch block:", error);
            return res.send(error);
          }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error:error });
      }
};

const updateSingleStudent = async (req, res) =>{

  try{
    const {rollNo,
      firstName,
      lastName,
      year,
      password,
      department,
      email,
      pEmail,
      gender,
      courseName,
      dob,
      contactNumber,
      sNumber,
      fatherName,
      fatherOccupation,
      fatherContactNumber,
      motherName,
      motherOccupation,
      motherContactNumber,
      bloodGroup,
      identificationMark,
      address,
      state,
      accHolderName,
      accNumber,
      bankName,
      IFSC} = req.body;

    const studentData = await db.students.findOne({
      where: { rollNo: rollNo }
    });

    if (!studentData) {
      return res.status(404).json({ error: 'Student not found' });
    }

    try {
      // Start the transaction
      const transaction = await db.sequelize.transaction();
      const filter = {};
      const profileFilter = {};
      const bankDetailsFilter = {};
      if(rollNo)filter.rollNo=rollNo;
      if(firstName)filter.firstName=firstName;
      if(lastName)filter.lastName=lastName;
      if(year)filter.year=year;
      if(department)filter.department=department;
      if(email)filter.email=email;
     if(pEmail)profileFilter.pEmail=pEmail;
     if(gender)profileFilter.gender=gender;
      if(courseName)profileFilter.courseName=courseName;
      if(dob)profileFilter.dob=dob;
      if(contactNumber)profileFilter.contactNumber=contactNumber;
      if(sNumber)profileFilter.sNumber=sNumber;
      if(fatherName)profileFilter.fatherName=fatherName;
      if(fatherOccupation)profileFilter.fatherOccupation=fatherOccupation;
      if(fatherContactNumber)profileFilter.fatherContactNumber=fatherContactNumber;
      if(motherName)profileFilter.motherName=motherName;
      if(motherOccupation)profileFilter.motherOccupation=motherOccupation;
      if(motherContactNumber)profileFilter.motherContactNumber=motherContactNumber;
      if(bloodGroup)profileFilter.bloodGroup=bloodGroup;
      if(identificationMark)profileFilter.identificationMark=identificationMark;
      if(address)profileFilter.address=address;
      if(state)profileFilter.state=state;
      if(accHolderName)bankDetailsFilter.accHolderName=accHolderName;
      if(accNumber)bankDetailsFilter.accNumber=accNumber;
      if(bankName)bankDetailsFilter.bankName=bankName;
      if(IFSC)bankDetailsFilter.IFSC=IFSC;

      try {
        // Update students
        const updatedStudents = await db.students.update(filter, {
          where: { rollNo: rollNo },
          transaction
        });

        // Update profiles
        const updatedProfiles = await db.profiles.update(profileFilter, {
          where: { rollNo: rollNo },
          transaction
        });

        // Update bankdetails
        const updatedBankDetails = await db.bankdetails.update(bankDetailsFilter, {
          where: { rollNo: rollNo },
          transaction
        });

        // Commit the transaction
        await transaction.commit();

        return res.json({ message: 'Student updated successfully' });
      }
      catch (error) {
        // Rollback the transaction on error
        await transaction.rollback();
        console.error("Error in transaction:", error);
        throw error; // Rethrow the error to handle it in the outer catch block
      }


    
  }catch(err){
    console.log("Outer catch block:", err);
    return res
  }

}
catch (error) {
  console.error(error);
  return res.status(500).json({ error:error });
}
};



module.exports = {singleStudentUpload,updateSingleStudent};