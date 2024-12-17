module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define(
        "Customer",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isEmail: true, // Ensure valid email format
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [3, 255], // Ensure password length is between 3 and 255 characters
                },
            },
            age: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isInt: true, // Ensure the age is an integer
                    min: 0, // Ensure the age is non-negative
                },
            },
        },
        {
            timestamps: false,
            tableName: "customers",
        }
    );

    Customer.associate = (models) => {
        // A Customer can have many Orders
        Customer.hasMany(models.Order, { foreignKey: "customer_id", as: "orders" });

        // A Customer can have many Comments
        Customer.hasMany(models.Comment, { foreignKey: "customer_id", as: "comments" });
    };

    return Customer;
};
