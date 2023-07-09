import { Knex } from "knex";

const knexConfig: Knex.Config = {
  client: "pg",
  connection: {
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "",
    database: "tennis_app",
  },
  migrations: {
    directory: "./src/data/migrations",
    tableName: "knex_migrations",
  },
  seeds: {
    directory: "./src/data/seeds",
  },
};

export default knexConfig;
