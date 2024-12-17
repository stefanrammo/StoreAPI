module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define(
        "Comment",
        {
            comment_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            customer_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            drink_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            comment: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            review_score: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            timestamps: false,
            tableName: "comments",
        }
    );

    Comment.associate = (models) => {
        // A Comment belongs to a Customer
        Comment.belongsTo(models.Customer, { foreignKey: "customer_id", as: "customer" });

        // A Comment belongs to a Drink
        Comment.belongsTo(models.Drink, { foreignKey: "drink_id", as: "drink" });
    };

    return Comment;
};
