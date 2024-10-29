import { Request, Response } from "express";
import { Category, Food } from "../models";

export async function listFoods(_req: Request, res: Response) {
  try {
    const foods = await Food.findAll({
      attributes: ["id", "name", "description", "price"],
      include: {
        model: Category,
        attributes: ["id", "name", "description"],
        as: "category",
      },
    });

    res.status(200).json({ message: "success", data: foods });
  } catch (error) {
    console.error("ListFoods:", error);

    res.status(500).json({ message: "error", error: "Something went wrong" });
  }
}
