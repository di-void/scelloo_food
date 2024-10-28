import { db } from ".";
import { Category, Food, User } from "../models";

// categories
const categories = [
  { name: "Burgers", description: "Delicious grilled and gourmet burgers." },
  {
    name: "Pizzas",
    description: "Freshly baked pizzas with a variety of toppings.",
  },
  { name: "Drinks", description: "Refreshing cold and hot beverages." },
  { name: "Desserts", description: "Sweet treats to finish your meal." },
];

// foods
const foods = [
  {
    name: "Classic Burger",
    description: "Beef patty, lettuce, tomato, and special sauce.",
    price: 5.99,
    categoryName: "Burgers",
  },
  {
    name: "Margherita Pizza",
    description: "Classic pizza with mozzarella, tomatoes, and basil.",
    price: 8.99,
    categoryName: "Pizzas",
  },
  {
    name: "Coke",
    description: "Chilled bottle of Coca-Cola.",
    price: 1.99,
    categoryName: "Drinks",
  },
  {
    name: "Chocolate Cake",
    description: "Rich chocolate cake slice with frosting.",
    price: 4.99,
    categoryName: "Desserts",
  },
];

// demo user
const demoUser = {
  name: "Demo User",
  email: "demo.user@example.com",
};

async function seed() {
  const sq = await db();

  if (!sq) throw Error("Couldn't get Sequelize Instance");

  try {
    await sq.sync({ force: true });
    console.log("Database synced!");

    const createdCategories = await Category.bulkCreate(categories);
    console.log("Categories seeded!");

    const categoryMap = createdCategories.reduce((map, category) => {
      // ts-footgun:
      // @ts-ignore
      map[category.name] = category.id;
      return map;
    }, {} as Record<string, string>);

    const foodWithCategory = foods.map((food) => ({
      ...food,
      categoryId: categoryMap[food.categoryName],
    }));

    await Food.bulkCreate(foodWithCategory);
    console.log("Foods seeded!");

    await User.create(demoUser);
    console.log("Demo user seeded!");

    console.log("Seeding Completed!");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await sq.close();
  }
}

async function undoSeed() {
  const sq = await db();

  if (!sq) throw Error("Couldn't get Sequelize Instance");

  try {
    await User.destroy({ where: { email: demoUser.email } });
    console.log("Demo User deleted.");

    await Food.destroy({ where: {} });
    console.log("Foods deleted.");

    await Category.destroy({ where: {} });
    console.log("Categories deleted.");

    console.log("Seed Undo Completed");
  } catch (error) {
    console.log("Error undoing seed data:", error);
  } finally {
    await sq.close();
  }
}

const action = process.argv[2];

if (action === "undo") {
  undoSeed();
} else {
  seed();
}
