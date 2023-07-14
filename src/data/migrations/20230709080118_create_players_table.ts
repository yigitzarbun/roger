import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable("trainer_employment_types", (table) => {
      table.increments("trainer_employment_type_id");
      table.string("trainer_employmment_type_name").unique().notNullable();
    })
    .createTable("locations", (table) => {
      table.increments("location_id");
      table.string("location_name").unique().notNullable();
    })
    .createTable("player_levels", (table) => {
      table.increments("player_level_id");
      table.string("player_level_name").unique().notNullable();
    })
    .createTable("trainer_experience", (table) => {
      table.increments("trainer_experience_id");
      table.string("trainer_experience_name").unique().notNullable();
    })
    .createTable("court_structure_types", (table) => {
      table.increments("court_structure_type_id");
      table.string("court_structure_type_name").unique().notNullable();
    })
    .createTable("court_surface_types", (table) => {
      table.increments("court_surface_type_id");
      table.string("court_surface_type_name").unique().notNullable();
    })
    .createTable("user_types", (table) => {
      table.increments("user_type_id");
      table.string("user_type_name").unique().notNullable();
    })
    .createTable("user_status_type", (table) => {
      table.increments("user_status_type_id");
      table.string("user_status_type_name").unique().notNullable();
    })
    .createTable("event_types", (table) => {
      table.increments("event_type_id");
      table.string("event_type_name").unique().notNullable();
    })
    .createTable("club_staff_role_types", (table) => {
      table.increments("club_staff_role_type_id");
      table.string("club_staff_role_type_name").unique().notNullable();
    })
    .createTable("club_staff_employment_types", (table) => {
      table.increments("club_staff_employment_type_id");
      table.string("club_staff_employment_type_name").unique().notNullable();
    })
    .createTable("club_staff_permission_types", (table) => {
      table.increments("club_staff_permission_type_id");
      table
        .increments("club_staff_permission_type_name")
        .unique()
        .notNullable();
    })
    .createTable("permission_types", (table) => {
      table.increments("permission_type_id");
      table.string("permission_type_name").unique().notNullable();
    })
    .createTable("booking_status_types", (table) => {
      table.increments("booking_status_type_id");
      table.string("booking_status_type_name").unique().notNullable();
    })
    // foreign key
    .createTable("users", (table) => {
      table.increments("user_id");
      table.integer("user_type_id").notNullable();
      table.string("email").unique().notNullable();
      table.string("password").notNullable();
      table.dateTime("registered_at").defaultTo(knex.fn.now()).notNullable();
      table.string("user_status_type_id").notNullable();
    })
    .createTable("players", (table) => {
      table.increments("player_id");
      table.string("fname").notNullable();
      table.string("lname").notNullable();
      table.string("birth_year").notNullable();
      table.string("gender").notNullable();
      table.integer("phone_number");
      table.string("image");
      table.string("player_bio_description");
      table.integer("location_id").notNullable();
      table.integer("player_level_id").notNullable();
      table.integer("user_id").notNullable();
    })
    .createTable("clubs", (table) => {
      table.increments("club_id");
      table.string("picture");
      table.string("club_address");
      table.string("club_bio_description");
      table.string("club_name").unique().notNullable();
      table.integer("location_id").notNullable();
      table.integer("user_id").notNullable();
    })
    .createTable("trainers", (table) => {
      table.increments("trainer_id");
      table.string("fname").notNullable();
      table.string("lname").notNullable();
      table.string("birth_year").notNullable();
      table.string("gender").notNullable();
      table.integer("price_hour").notNullable();
      table.integer("phone_number");
      table.string("image");
      table.string("tainer_bio_description");
      table.integer("club_id").defaultTo(1).notNullable();
      table.integer("trainer_experience_id").notNullable();
      table.integer("location_id").notNullable();
      table.integer("player_level_id").notNullable();
      table.integer("trainer_employment_type_id").notNullable();
      table.integer("user_id").notNullable();
    })
    .createTable("permissions", (table) => {
      table.increments("permission_id");
      table.dateTime("registered_at").defaultTo(knex.fn.now()).notNullable();
      table.integer("permission_type_id").notNullable();
      table.integer("club_id").notNullable();
      table.integer("trainer_id").notNullable();
    })
    .createTable("club_staff", (table) => {
      table.integer("club_staff_id");
      table.string("fname").notNullable();
      table.string("lname").notNullable();
      table.string("birth_year").notNullable();
      table.string("gender").notNullable();
      table.integer("gross_salary_month").notNullable();
      table.integer("bank_account_no");
      table.integer("phone_number");
      table.string("image");
      table.integer("club_id").notNullable();
      table.integer("club_staff_employment_type_id").notNullable();
      table.integer("club_staff_role_type_id").notNullable();
      table.integer("permission_id").notNullable();
      table.integer("user_id").notNullable();
    })
    .createTable("club_external_members", (table) => {
      table.increments("club_external_member_id");
      table.integer("member_id");
      table.string("email");
      table.string("fname").notNullable();
      table.string("lname").notNullable();
      table.string("birth_year").notNullable();
      table.string("gender").notNullable();
      table.integer("club_id").notNullable();
    })
    .createTable("courts", (table) => {
      table.increments("court_id");
      table.string("court_name");
      table.dateTime("registered_at").defaultTo(knex.fn.now()).notNullable();
      table.time("opening_time").notNullable();
      table.time("closing_time").notNullable();
      table.integer("price").notNullable();
      table.integer("court_structure_type_id").notNullable();
      table.integer("court_surface_type_id").notNullable();
      table.integer("club_id").notNullable();
    })
    .createTable("bookings", (table) => {
      table.increments("booking_id");
      table.dateTime("registered_at").defaultTo(knex.fn.now()).notNullable();
      table.integer("booking_status_type_id").notNullable();
      table.date("event_date").notNullable();
      table.time("event_time").notNullable();
      table.integer("event_type_id").notNullable();
      table.integer("club_id").notNullable();
      table.integer("court_id").notNullable();
      table.integer("inviter_id").notNullable();
      table.integer("invitee_id").notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("players");
}
