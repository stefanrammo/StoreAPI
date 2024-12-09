const { Sequelize, DataTypes } = require("sequelize");

// Initialize Sequelize with environment variables
const sequelize = new Sequelize(
    process.env.DB_DATANAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOSTNAME,
        dialect: "mariadb",
        logging: console.log, // Log SQL queries to the console
    }
);

// Test the database connection
(async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Connection failed: " + error.message);
        process.exit(1); // Exit the process if the connection fails
    }
})();

// Initialize models
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.drinks = require("./models/drink")(sequelize, DataTypes);

// Synchronize models
const sync = async () => {
    try {
        await sequelize.sync({ alter: true }); // Alter database schema to match models
        console.log("Models have been synchronized successfully.");
    } catch (error) {
        console.error("Model synchronization failed: " + error.message);
    }
};

module.exports = { db, sync };
