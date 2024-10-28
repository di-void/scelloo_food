import { Sequelize } from "sequelize";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER } from "../config/env";

const DB_URL = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?sslmode=require`;

export const sequelize = new Sequelize(DB_URL);

export async function db() {
  try {
    await authenticate();
    return sequelize;
  } catch (error) {
    console.log("Unable to connect to the database", error);
    return null;
  }
}

export async function authenticate() {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
}
