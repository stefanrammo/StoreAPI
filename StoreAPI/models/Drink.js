const { DESCRIBE } = require("sequelize/lib/query-types");

module.exports = (sequelize, DataTypes) => {
    const Drink = sequelize.define(
        "Drink",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            order_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            expiration_date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true
            }
        },
        {
            timestamps: false, // Disable automatic creation of createdAt and updatedAt fields
            tableName: "drinks", // Explicitly specify the table name
        }
    );

    return Drink;
};
