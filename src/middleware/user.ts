import { NextFunction, Request, Response } from "express";
import { OrderInput } from "../utils/validators";
import { formatZodError } from "../utils/helpers";
import { db } from "../db";
import { Food, User } from "../models";
import { Op } from "sequelize";

export async function validateOrder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // validate input
  const result = OrderInput.safeParse(req.body);

  if (!result.success) {
    res
      .status(400)
      .json({ message: "error", error: formatZodError(result.error) });
    return;
  }

  const { userId, items } = result.data;

  const sq = await db();

  if (!sq) {
    res.status(500).json({ message: "error", error: "Database error" });
    return;
  }

  try {
    // does this user exist?
    const user = await User.findOne({ where: { id: userId } });

    if (user === null) {
      res.status(400).json({ message: "error", error: "User not found" });
      return;
    }

    // do these food Items exist?
    const foodIds = items.map((item) => item.id);
    const existingFoods = await Food.findAll({
      attributes: ["id"],
    });

    // ts-footgun
    // @ts-ignore
    const existingFoodIds = existingFoods.map((food) => food.id);
    const missingFoodIds = foodIds.filter(
      (id) => !existingFoodIds.includes(id)
    );

    if (missingFoodIds.length > 0) {
      res.status(400).json({
        message: "error",
        error: `Food with IDs ${missingFoodIds.join(", ")} do not exist`,
      });
      return;
    }

    next();
  } catch (error) {
    console.error("ValidateOrder:", error);

    res.status(500).json({ message: "error", error: "Something went wrong" });
  }
}
