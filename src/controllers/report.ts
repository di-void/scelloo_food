import { Request, Response } from "express";
import { Op } from "sequelize";
import { db } from "../db";
import { Food, Order } from "../models";

// assuming day starts at midnight
export async function generateOrderReport(_req: Request, res: Response) {
  // get current date
  const now = new Date();

  const midnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0
  ).getMilliseconds();

  const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

  const sq = await db();

  if (sq === null) {
    res.status(500).json({ message: "error", error: "Database error" });
    return;
  }

  // query for orders bewteen midnight and now
  try {
    const result = await sq.transaction(async (t) => {
      // sum of all order prices
      const sum = await Order.sum("total_price", {
        where: {
          createdAt: {
            [Op.between]: [midnight, now],
          },
        },
      });

      // order items
      const res = await Order.findAndCountAll({
        where: {
          createdAt: {
            [Op.between]: [midnight, now],
          },
        },
        include: {
          model: Food,
          attributes: ["id", "name", "price"],
          as: "foods",
          through: {
            attributes: ["quantity"],
            as: "orders",
          },
        },
        transaction: t,
      });

      // total orders
      const totalOrders = res.count;

      // res
      const orders = res.rows;

      return { totalAmount: sum, totalOrders, orders };
    });

    res.status(200).json({
      message: "success",
      data: {
        date,
        totalOrders: result.totalOrders,
        totalAmount: result.totalAmount,
        orders: result.orders,
      },
    });
  } catch (error) {
    console.error("GenerateReport:", error);

    res.status(500).json({ message: "error", error: "Something went wrong." });
  }
}
