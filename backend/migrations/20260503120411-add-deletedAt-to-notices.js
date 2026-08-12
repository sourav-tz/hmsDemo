// Bug fix by Ravi: Bug 3 - Migration to add deletedAt column for soft deletes in notices table
module.exports = {
up: async (queryInterface, Sequelize) => {
  // Bug fix by Ravi: Bug 3 - Guard added because migration 20250503120000-add-fields-to-notices may have already added this column; without the check Sequelize throws "Duplicate column name 'deletedAt'"
  const tableDescription = await queryInterface.describeTable('notices');
  if (!tableDescription.deletedAt) {
    await queryInterface.addColumn('notices', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  }
},
down: async (queryInterface) => {
  const tableDescription = await queryInterface.describeTable('notices');
  if (tableDescription.deletedAt) {
    await queryInterface.removeColumn('notices', 'deletedAt');
  }
}
};