const { Sequelize } = require("sequelize");
require("dotenv").config();

const DB_NAME = process.env.DB_NAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_DIALECT = process.env.DB_DIALECT;
const DB_PORT = process.env.DB_PORT;

const db = new Sequelize(DB_NAME, DB_DIALECT, DB_PASSWORD, {
  dialect: DB_DIALECT, // Use 'postgres' as the dialect for PostgreSQL
  host: DB_HOST, // Change this to your PostgreSQL server's host
  port: DB_PORT,
});

module.exports = db;
