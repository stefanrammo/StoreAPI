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
            timestamps: false, // Disable automatic creation of createdAt and updatedAt fields
            tableName: "customers", // Explicitly specify the table name
        }
    );

    return Customer;
};
