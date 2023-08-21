import { Knex } from "knex";

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: "pg", // Specify the correct database client, e.g., 'pg' for PostgreSQL
    connection: {
      // Database connection details
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
  },
  // ... other environments (e.g., production, testing)
};

export = knexConfig;
