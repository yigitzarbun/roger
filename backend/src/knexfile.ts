import { Knex } from "knex";
import path from "path";

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: "127.0.0.1",
      port: 5432,
      user: "postgres",
      password: "",
      database: "tennis_app",
    },
    migrations: {
      directory: path.join(__dirname, "data/migrations"), // Keep this as it is
      tableName: "knex_migrations",
    },
    seeds: {
      directory: path.join(__dirname, "data/seeds"), // Keep this as it is
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
      directory: path.resolve(__dirname, "data/migrations"),
      tableName: "knex_migrations",
    },

    seeds: {
      directory: path.join(__dirname, "data/seeds"), // Keep this as it is
    },
  },
};

export = knexConfig;
