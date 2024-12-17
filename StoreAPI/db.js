const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_DATANAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOSTNAME,
        dialect: "mariadb",
        logging: console.log,
    }
);

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Connection failed: " + error);
    }
})();

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import Models
db.drinks = require("./models/Drink")(sequelize, DataTypes);
db.customers = require("./models/Customer")(sequelize, DataTypes);
db.orders = require("./models/Order")(sequelize, DataTypes);
db.comments = require("./models/Comment")(sequelize, DataTypes);

// Define Relationships

// A Customer can have many Orders
db.customers.hasMany(db.orders, { foreignKey: "customer_id", as: "orders" });
db.orders.belongsTo(db.customers, { foreignKey: "customer_id", as: "customer" });

// A Drink can have many Comments
db.drinks.hasMany(db.comments, { foreignKey: "drink_id", as: "comments" });
db.comments.belongsTo(db.drinks, { foreignKey: "drink_id", as: "drink" });

// A Customer can have many Comments
db.customers.hasMany(db.comments, { foreignKey: "customer_id", as: "comments" });
db.comments.belongsTo(db.customers, { foreignKey: "customer_id", as: "customer" });

// An Order can have many Drinks through Order_Drinks (many-to-many)
db.orders.belongsToMany(db.drinks, {
    through: "Order_Drinks", // This is the join table
    foreignKey: "order_id",
    as: "drinks",
});
db.drinks.belongsToMany(db.orders, {
    through: "Order_Drinks",
    foreignKey: "drink_id",
    as: "orders",
});

// Sync the models without altering the database
const sync = async () => {
    // Avoid altering the schema automatically on subsequent runs
    await sequelize.sync({ force: false }); // Use force: false to avoid altering the schema
    console.log("Models have been synchronized successfully.");
};

sync();

module.exports = { db, sync };
