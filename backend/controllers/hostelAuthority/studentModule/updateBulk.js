const db = require('../../../models/index')


exports.updateBulk = async (req, res) => {
    try {
      //? get json data from body
        const jsonObj = req.body;
      try {
        // Start the transaction
        const transaction = await db.sequelize.transaction();
      
        try {
          const student = await Book.findByPk(bookId, { include: Author });
          await transaction.commit();
      
          return res.json();
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
      
    } catch (err) {
        res.json(err + "");
    }
  }