import { Request, Response } from "express";
import { Food, FoodOrders, Order } from "../models";
import {
  OrderInput,
  OrderInputType,
  Order as OrderValidator,
} from "../utils/validators";
import { formatZodError } from "../utils/helpers";
import { db } from "../db";

export async function listOrders(_req: Request, res: Response) {
  try {
    // get list of orders
    const orders = await Order.findAll();

    res.status(200).json({ message: "success", data: orders });
  } catch (error) {
    console.error("ListOrders:", error);

    res.status(500).json({ message: "error", error: "Something went wrong" });
  }
}

export async function createOrder(req: Request, res: Response) {
  const body = req.body as OrderInputType;

  const sq = await db();

  const { userId, items } = body;

  if (!sq) {
    res.status(500).json({ message: "error", error: "Database error" });
    return;
  }

  try {
    const foodPricesPromises = items.map((item) => {
      return Food.findOne({
        where: { id: item.id },
        attributes: ["price", "id"],
      });
    });

    const prices = await Promise.all(foodPricesPromises);

    const tPrice = prices.reduce((acc, curr, idx) => {
      //   ts-footgun
      //   @ts-ignore
      const price = parseFloat(curr.price);

      // ts-footgun
      // @ts-ignore
      return acc + price * items[idx]?.quantity;
    }, 0);

    const result = await sq.transaction(async (t) => {
      // try creating order
      const totalPrice = parseFloat(tPrice.toFixed(2));

      const o = await Order.create(
        { UserId: userId, totalPrice, status: "pending" },
        {
          returning: [
            "id",
            "status",
            "created_at",
            "updated_at",
            "total_price",
          ],
          transaction: t,
        }
      );

      const order = OrderValidator.parse(o);

      const orderFoodsPromises = items.map((item) => {
        return FoodOrders.create(
          {
            foodId: item.id,
            orderId: order.id,
            quantity: item.quantity,
          },
          { transaction: t }
        );
      });

      await Promise.all(orderFoodsPromises);
      return order;
    });

    //   get order and food
    const orderWithFoods = await Order.findOne({
      where: { id: result.id },
      include: [
        {
          model: Food,
          attributes: ["id", "name", "description", "price"],
          through: {
            attributes: ["quantity"],
          },
        },
      ],
    });

    res.status(200).json({
      message: "success",
      data: orderWithFoods,
    });
  } catch (error) {
    console.log("CreateOrder:", error);

    res.status(500).json({ message: "error", error: "Something went wrong." });
  }
}
