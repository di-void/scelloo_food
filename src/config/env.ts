import "dotenv/config";

// port
export const PORT = process.env.PORT || 3000;

// Database Credentials
export const DB_HOST = process.env.DB_HOST || "";
export const DB_NAME = process.env.DB_NAME || "";
export const DB_USER = process.env.DB_USER || "";
export const DB_PORT = process.env.DB_PORT || "";
export const DB_PASSWORD = process.env.DB_PASSWORD || "";

// API
export const API_VERSION = 1;
