import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable("trainer_employment_types", (table) => {
      table.increments("trainer_employment_type_id");
      table.string("trainer_employment_type_name").unique().notNullable();
    })
    .createTable("locations", (table) => {
      table.increments("location_id");
      table.string("location_name").unique().notNullable();
    })
    .createTable("club_types", (table) => {
      table.increments("club_type_id");
      table.string("club_type_name").unique().notNullable();
    })
    .createTable("player_levels", (table) => {
      table.increments("player_level_id");
      table.string("player_level_name").unique().notNullable();
    })
    .createTable("trainer_experience_types", (table) => {
      table.increments("trainer_experience_type_id");
      table.string("trainer_experience_type_name").unique().notNullable();
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
    .createTable("user_status_types", (table) => {
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
    .createTable("permission_types", (table) => {
      table.increments("permission_type_id");
      table.string("permission_type_name").unique().notNullable();
    })
    .createTable("booking_status_types", (table) => {
      table.increments("booking_status_type_id");
      table.string("booking_status_type_name").unique().notNullable();
    })
    .createTable("users", (table) => {
      table.increments("user_id");
      table.string("email").unique().notNullable();
      table.string("password").notNullable();
      table.dateTime("registered_at").defaultTo(knex.fn.now()).notNullable();
      table
        .integer("user_type_id")
        .unsigned()
        .notNullable()
        .references("user_type_id")
        .inTable("user_types")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("user_status_type_id")
        .unsigned()
        .notNullable()
        .references("user_status_type_id")
        .inTable("user_status_types")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
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
      table.boolean("is_premium").defaultTo(false).notNullable();
      table.string("name_on_card");
      table.integer("card_number");
      table.integer("cvc");
      table
        .integer("location_id")
        .unsigned()
        .notNullable()
        .references("location_id")
        .inTable("locations")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("player_level_id")
        .unsigned()
        .notNullable()
        .references("player_level_id")
        .inTable("player_levels")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("clubs", (table) => {
      table.increments("club_id");
      table.string("picture");
      table.string("club_address");
      table.string("club_bio_description");
      table.string("club_name").unique().notNullable();
      table.boolean("is_premium").defaultTo(false).notNullable();
      table.integer("phone_number");
      table.integer("bank_account_no");
      table.string("bank_name");
      table.string("name_on_bank_account");
      table
        .boolean("is_player_subscription_required")
        .defaultTo(false)
        .notNullable();
      table
        .boolean("is_trainer_subscription_required")
        .defaultTo(false)
        .notNullable();
      table
        .integer("location_id")
        .unsigned()
        .notNullable()
        .references("location_id")
        .inTable("locations")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("club_type_id")
        .unsigned()
        .notNullable()
        .references("club_type_id")
        .inTable("club_types")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
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
      table.string("trainer_bio_description");
      table.integer("bank_account_no");
      table.string("bank_name");
      table.string("name_on_bank_account");
      table.boolean("is_premium").defaultTo(false).notNullable();
      table
        .integer("club_id")
        .unsigned()
        .references("club_id")
        .inTable("clubs")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("trainer_experience_type_id")
        .unsigned()
        .notNullable()
        .references("trainer_experience_type_id")
        .inTable("trainer_experience_types")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("location_id")
        .unsigned()
        .notNullable()
        .references("location_id")
        .inTable("locations")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("trainer_employment_type_id")
        .unsigned()
        .notNullable()
        .references("trainer_employment_type_id")
        .inTable("trainer_employment_types")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("club_staff", (table) => {
      table.increments("club_staff_id");
      table.string("fname").notNullable();
      table.string("lname").notNullable();
      table.string("birth_year").notNullable();
      table.string("gender").notNullable();
      table.string("employment_status").notNullable();
      table.integer("gross_salary_month");
      table.integer("bank_account_no");
      table.string("bank_name");
      table.integer("phone_number");
      table.string("image");
      table
        .integer("club_id")
        .unsigned()
        .notNullable()
        .references("club_id")
        .inTable("clubs")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("club_staff_role_type_id")
        .unsigned()
        .notNullable()
        .references("club_staff_role_type_id")
        .inTable("club_staff_role_types")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("permissions", (table) => {
      table.increments("permission_id");
      table.dateTime("registered_at").defaultTo(knex.fn.now()).notNullable();
      table
        .integer("permission_type_id")
        .unsigned()
        .notNullable()
        .references("permission_type_id")
        .inTable("permission_types")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("club_id")
        .unsigned()
        .notNullable()
        .references("club_id")
        .inTable("clubs")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("club_staff_id")
        .unsigned()
        .notNullable()
        .references("club_staff_id")
        .inTable("club_staff")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("club_external_members", (table) => {
      table.increments("club_external_member_id");
      table.integer("member_id");
      table.string("email");
      table.string("fname").notNullable();
      table.string("lname").notNullable();
      table.string("birth_year").notNullable();
      table.string("gender").notNullable();
      table
        .integer("club_id")
        .unsigned()
        .notNullable()
        .references("club_id")
        .inTable("clubs")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("courts", (table) => {
      table.increments("court_id");
      table.string("court_name");
      table.dateTime("registered_at").defaultTo(knex.fn.now()).notNullable();
      table.time("opening_time").notNullable();
      table.time("closing_time").notNullable();
      table.integer("price_hour").notNullable();
      table
        .integer("court_structure_type_id")
        .unsigned()
        .notNullable()
        .references("court_structure_type_id")
        .inTable("court_structure_types")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("court_surface_type_id")
        .unsigned()
        .notNullable()
        .references("court_surface_type_id")
        .inTable("court_surface_types")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("club_id")
        .unsigned()
        .notNullable()
        .references("club_id")
        .inTable("clubs")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("bookings", (table) => {
      table.increments("booking_id");
      table.dateTime("registered_at").defaultTo(knex.fn.now()).notNullable();
      table.date("event_date").notNullable();
      table.time("event_time").notNullable();
      table.integer("court_price").notNullable();
      table.integer("lesson_price");
      table
        .integer("booking_status_type_id")
        .unsigned()
        .notNullable()
        .references("booking_status_type_id")
        .inTable("booking_status_types")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("event_type_id")
        .unsigned()
        .notNullable()
        .references("event_type_id")
        .inTable("event_types")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("club_id")
        .unsigned()
        .notNullable()
        .references("club_id")
        .inTable("clubs")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("court_id")
        .unsigned()
        .notNullable()
        .references("court_id")
        .inTable("courts")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("inviter_id")
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("invitee_id")
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("club_subscription_types", (table) => {
      table.increments("club_subscription_type_id");
      table.string("club_subscription_type_name");
      table.string("club_subscription_duration_months");
    })
    .createTable("club_subscription_packages", (table) => {
      table.increments("club_subscription_package_id");
      table.integer("price").notNullable();
      table.dateTime("registered_at").defaultTo(knex.fn.now()).notNullable();
      table.boolean("isActive").defaultTo(true).notNullable();
      table
        .integer("club_subscription_type_id")
        .unsigned()
        .notNullable()
        .references("club_subscription_type_id")
        .inTable("club_subscription_types")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("club_id")
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("club_subscriptions", (table) => {
      table.increments("club_subscription_id");
      table.dateTime("registered_at").defaultTo(knex.fn.now()).notNullable();
      table.dateTime("start_date").notNullable();
      table.dateTime("end_date").notNullable();
      table.boolean("isActive").defaultTo(true).notNullable();
      table
        .integer("club_id")
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("player_id")
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("club_subscription_package_id")
        .unsigned()
        .notNullable()
        .references("club_subscription_package_id")
        .inTable("club_subscription_packages")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("favourites", (table) => {
      table.increments("favourite_id");
      table.dateTime("registered_at").defaultTo(knex.fn.now()).notNullable();
      table.boolean("isActive").notNullable();
      table
        .integer("favouriter_id")
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("favouritee_id")
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    });
  await knex.raw(`
    UPDATE bookings
    SET booking_status_type_id = 4
    WHERE booking_status_type_id = 1
      AND registered_at <= NOW() - INTERVAL '1 minute';
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .dropTableIfExists("favourites")
    .dropTableIfExists("club_subscriptions")
    .dropTableIfExists("club_subscription_packages")
    .dropTableIfExists("club_subscription_types")
    .dropTableIfExists("bookings")
    .dropTableIfExists("courts")
    .dropTableIfExists("club_external_members")
    .dropTableIfExists("permissions")
    .dropTableIfExists("club_staff")
    .dropTableIfExists("trainers")
    .dropTableIfExists("clubs")
    .dropTableIfExists("players")
    .dropTableIfExists("users")
    .dropTableIfExists("booking_status_types")
    .dropTableIfExists("permission_types")
    .dropTableIfExists("club_staff_employment_types")
    .dropTableIfExists("club_staff_role_types")
    .dropTableIfExists("event_types")
    .dropTableIfExists("user_status_types")
    .dropTableIfExists("user_types")
    .dropTableIfExists("court_surface_types")
    .dropTableIfExists("court_structure_types")
    .dropTableIfExists("trainer_experience_types")
    .dropTableIfExists("player_levels")
    .dropTableIfExists("club_types")
    .dropTableIfExists("locations")
    .dropTableIfExists("trainer_employment_types");
}
