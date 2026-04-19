const db = require('../../../models/index')
//* read 
//* add
//* softdelete (disable)
//* permanent delete (can only delete if mistakenly added) it will be resticted if course student exists
//* enable course (if in res softdelete attribute is not null then show row as disabled )
//*update 
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config(
  {
    path: "../../.env"
  }
)

//Sourav

const getCourses = async (req, res) => {
  try {
    // ✅ Include both active & soft-deleted
    const data = await db.courses.findAll({ paranoid: false });

    // Add "active" flag manually
    const result = data.map(course => ({
      ...course.dataValues,
      active: course.deletedAt === null
    }));

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};
//end
const addCourse = async (req, res) => {
  try {
    const { courseName, department, specialization, courseDuration } = req.body;
    const token = req.cookies.hostelAccessToken;
    const { email } = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // 🔹 Duplicate check (include soft-deleted)
    const existingCourse = await db.courses.findOne({
      where: {
        courseName,
        department,
        specialization,
        courseDuration
      },
      paranoid: false, // include inactive (soft-deleted) rows
    });

    if (existingCourse) {
      if (existingCourse.deletedAt !== null) {
        // means course inactive
        return res.status(400).json({
          msg: "Course already exists but is inactive. Please activate it instead of creating new."
        });
      } else {
        return res.status(400).json({ msg: "Course with this name already exists." });
      }
    }

    // 🔹 Create new course
    const courseCreated = await db.courses.create({
      courseName,
      department,
      specialization,
      courseDuration,
      lastUpdatedBy: email
    });

    return res.status(200).json({
      msg: "Course created successfully",
      data: courseCreated
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};
//end

const removeCourse = async (req, res) => {
  try {
    const { courseId } = req.query;

    // check course exists (include soft-deleted)
    const course = await db.courses.findOne({ where: { courseId }, paranoid: false });
    if (!course) return res.status(400).json({ message: "Course not found" });

    // soft delete the course
    await db.courses.destroy({ where: { courseId } }); // paranoid:true → soft delete

    return res.status(200).json({ message: "Course inactivated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};
//end

const enableCourse = async (req,res)=>{
    try {
        const { courseId } = req.body;
        await db.courses.restore({ where: { courseId } });
        return res.status(200).json({ message: "Course activated successfully" });
    } catch(error){
        console.error(error);
        return res.status(500).json({ error });
    }
}
//end

const { Op } = require('sequelize');

const updateCourse = async (req, res) => {
  try {
    const { courseId, courseName, department, specialization, courseDuration } = req.body;

    if (!courseId) return res.status(400).json({ message: "courseId is required" });

    const course = await db.courses.findByPk(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const updates = {};
    const token = req.cookies.hostelAccessToken;
    const { email } = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Course Name update
    if (courseName !== undefined && courseName !== course.courseName) {
      updates.courseName = courseName;
    }

    // Department update
    if (department !== undefined && department !== course.department) {
      updates.department = department;
    }

    // Specialization update with duplicate check
    if (specialization !== undefined && specialization !== course.specialization) {
      // Check if specialization already exists in other courses
      const existingCourse = await db.courses.findOne({
        where: {
          specialization,
          courseId: { [Op.ne]: courseId }
        },
        paranoid: false
      });

      if (existingCourse) {
        return res.status(400).json({
          message: "Course with same specialization already exists"
        });
      }
      updates.specialization = specialization;
    }

    // FIXED: Course Duration update - handle various input types
    if (courseDuration !== undefined && courseDuration !== null) {
      // Convert to number and validate
      const duration = Number(courseDuration);
      
      // Check if it's a valid positive number
      if (!isNaN(duration) && duration > 0 && duration !== course.courseDuration) {
        updates.courseDuration = duration;
      } else if (isNaN(duration)) {
        return res.status(400).json({ 
          message: "Course duration must be a valid number" 
        });
      }
      // If duration is same as current, no update needed
    }

    // Add who updated the record
    updates.lastUpdatedBy = email;

    // Check if any updates are actually being made
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No changes detected" });
    }

    // Perform the update
    await db.courses.update(updates, { where: { courseId } });

    // Return updated course data
    const updatedCourse = await db.courses.findByPk(courseId);
    return res.status(200).json({
      message: "Course updated successfully",
      data: updatedCourse
    });

  } catch (error) {
    console.error("❌ Error updating course:", error);
    
    // Handle specific errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: "Invalid token" });
    }
    
    return res.status(500).json({ error: error.message });
  }
};


module.exports={
  getCourses,addCourse,removeCourse,enableCourse,updateCourse
}