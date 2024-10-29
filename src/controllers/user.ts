import { Request, Response } from "express";
import { User } from "../models";
import { UserParams, User as UserValidator } from "../utils/validators";
import { formatZodError } from "../utils/helpers";

export async function listUsers(_req: Request, res: Response) {
  try {
    // query for all users
    const users = await User.findAll({ attributes: ["id", "name", "email"] });

    // return list
    res.status(200).json({ message: "success", data: users });
  } catch (error) {
    console.error("ListUsers(Model):", error);

    res.status(500).json({ message: "error", error: "something went wrong" });
  }
}

export async function createUser(req: Request, res: Response) {
  // validate input
  const body = req.body;
  const result = UserValidator.safeParse(body);

  if (!result.success) {
    res
      .status(422)
      .json({ message: "error", error: formatZodError(result.error) });
    return;
  }

  const { email, name } = result.data;

  try {
    // create user record
    const newUser = await User.create(
      { name, email },
      { fields: ["name", "email"], returning: ["id", "name", "email"] }
    );

    // return user record
    res.status(200).json({ message: "success", data: newUser });
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        res
          .status(400)
          .json({ message: "error", error: "Email already exists" });
      }
    } else {
      console.error("CreateUser(Model):", error);

      res.status(500).json({ message: "error", error: "something went wrong" });
    }
  }
}

export async function deleteUser(req: Request, res: Response) {
  // parse input
  const params = req.params;

  const result = UserParams.safeParse(params);

  if (!result.success) {
    res
      .status(400)
      .json({ message: "error", error: formatZodError(result.error) });
    return;
  }

  const { userId } = result.data;

  try {
    // if valid try delete
    const nRows = await User.destroy({
      where: {
        id: userId,
      },
    });

    // return apt response when user doesn't exist
    if (nRows === 0) {
      res.status(404).json({
        message: "error",
        error: `User with ID: ${userId} not found.`,
      });
      return;
    }

    // delete user
    res.status(200).json({
      message: "success",
      data: { msg: "User deleted successfully." },
    });
  } catch (error) {
    console.log("DeleteUser(Model):", error);

    res.status(500).json({ message: "error", error: "Something went wrong." });
  }
}
