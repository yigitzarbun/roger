"use strict";
const path = require("path");

const knexConfig = {
  development: {
    client: "pg",
    connection: {
      host: "localhost",
      port: 5432,
      user: "postgres",
      password: "",
      database: "tennis_app",
    },
    migrations: {
      directory: path.join(__dirname, "src/data/migrations"),
      tableName: "knex_migrations",
    },
    seeds: {
      directory: path.join(__dirname, "src/data/seeds"),
    },
  },
  production: {
    client: "pg",
    connection: {
      host: "fdaa:a:2413:0:1::a",
      port: 5432,
      user: "postgres",
      password: "eGKUPKhCp0A92Ao",
      database: "tennis_app",
    },
    migrations: {
      // Use the absolute path without duplicating 'src' in production
      directory: path.join(__dirname, "data/migrations"),
      tableName: "knex_migrations",
    },
    seeds: {
      directory: path.join(__dirname, "data/seeds"),
    },
  },
};

module.exports = knexConfig;
