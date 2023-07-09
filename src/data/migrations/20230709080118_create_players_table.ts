import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("players", (table) => {
    table.increments("player_id");
    table.string("user_type").notNullable();
    table.string("player_status").notNullable();
    table.dateTime("registered_at").defaultTo(knex.fn.now()).notNullable();
    table.string("email").notNullable().unique();
    table.string("password").notNullable();
    table.string("fname").notNullable();
    table.string("lname").notNullable();
    table.string("birth_year").notNullable();
    table.string("image");
    table.string("location").notNullable();
    table.string("gender").notNullable();
    table.string("level").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("players");
}
