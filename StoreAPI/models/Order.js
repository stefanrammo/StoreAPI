module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define(
        "Order",
        {
            order_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            customer_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            order_date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            timestamps: false,
            tableName: "orders",
        }
    );

    Order.associate = (models) => {
        // An Order belongs to a Customer
        Order.belongsTo(models.Customer, { foreignKey: "customer_id", as: "customer" });

        // An Order can have many Drinks through the Order_Drinks table
        Order.belongsToMany(models.Drink, {
            through: "Order_Drinks", // Join table
            foreignKey: "order_id",
            as: "drinks",
        });
    };

    return Order;
};
