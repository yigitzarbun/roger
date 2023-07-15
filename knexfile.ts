/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
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
};

//export default knexConfig;
