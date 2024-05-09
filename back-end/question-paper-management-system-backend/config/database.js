const { Sequelize } = require('sequelize');

// Initialize Sequelize with MySQL database credentials
const sequelize = new Sequelize('PYQ_management_system', 'root', '12345', {
  host: 'localhost', // Database host
  dialect: 'mysql', // Database dialect
});

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
