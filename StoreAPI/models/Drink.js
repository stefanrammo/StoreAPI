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
                allowNull: true, // Optional: Consider removing if using many-to-many relationship
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
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            timestamps: false,
            tableName: "drinks",
        }
    );

    Drink.associate = (models) => {
        // A Drink can have many Comments
        Drink.hasMany(models.Comment, {
            foreignKey: "drink_id",
            as: "comments",
        });

        // A Drink can belong to many Orders through Order_Drinks
        Drink.belongsToMany(models.Order, {
            through: "Order_Drinks", // Join table for many-to-many
            foreignKey: "drink_id",
            as: "orders",
        });
    };

    return Drink;
};
