// models
import { DataTypes } from "sequelize";
import { sequelize } from "../db";

// models
export const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    //   timestamps included by default
  },
  { tableName: "users", underscored: true }
);

export const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    //   timestamps included by default
  },
  { tableName: "categories", underscored: true }
);

export const Food = sequelize.define(
  "Food",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.DECIMAL,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Category,
        key: "id",
      },
    },
    //   timestamps included by default
  },
  { tableName: "foods", underscored: true }
);

export const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["pending", "completed", "cancelled"],
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.DECIMAL,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    //   timestamps included by default
  },
  { tableName: "orders", underscored: true }
);

export const FoodOrders = sequelize.define(
  "FoodOrders",
  {
    foodId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      references: {
        model: Food,
        key: "id",
      },
    },
    orderId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      references: {
        model: Order,
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    //   timestamps included by default
  },
  { tableName: "food_orders", underscored: true }
);

// assocations

// order/user
Order.belongsTo(User, {
  onDelete: "CASCADE",
  foreignKey: { allowNull: false },
});
User.hasMany(Order, { onDelete: "CASCADE", foreignKey: { allowNull: false } });

// category/food
Food.belongsTo(Category, {
  onDelete: "CASCADE",
  foreignKey: { allowNull: false },
}); // a food item belongs to a single category
Category.hasMany(Food, {
  onDelete: "CASCADE",
  foreignKey: { allowNull: false },
}); // a category has many food items

// pivot table for order/food
Food.belongsToMany(Order, { through: FoodOrders });
Order.belongsToMany(Food, { through: FoodOrders, as: "foods" });
