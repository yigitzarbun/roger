import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("bookings").del();
  await knex("courts").del();
  await knex("club_external_members").del();
  await knex("permissions").del();
  await knex("club_staff").del();
  await knex("trainers").del();
  await knex("clubs").del();
  await knex("players").del();
  await knex("users").del();
  await knex("booking_status_types").del();
  await knex("permission_types").del();
  await knex("club_staff_employment_types").del();
  await knex("club_staff_role_types").del();
  await knex("event_types").del();
  await knex("user_status_types").del();
  await knex("user_types").del();
  await knex("court_surface_types").del();
  await knex("court_structure_types").del();
  await knex("trainer_experience_types").del();
  await knex("player_levels").del();
  await knex("club_types").del();
  await knex("locations").del();
  await knex("trainer_employment_types").del();

  // Inserts seed entries
  await knex("trainer_employment_types").insert([
    {
      trainer_employment_type_id: 1,
      trainer_employment_type_name: "independent",
    },
    {
      trainer_employment_type_id: 2,
      trainer_employment_type_name: "private_club",
    },
    {
      trainer_employment_type_id: 3,
      trainer_employment_type_name: "public_club",
    },
  ]);

  await knex("locations").insert([
    { location_id: 1, location_name: "Adalar" },
    { location_id: 2, location_name: "Ataşehir" },
    { location_id: 3, location_name: "Bakırköy" },
    { location_id: 4, location_name: "Beşiktaş" },
    { location_id: 5, location_name: "Beykoz" },
    { location_id: 6, location_name: "Beyoğlu" },
    { location_id: 7, location_name: "Çekmeköy" },
    { location_id: 8, location_name: "Kadıköy" },
    { location_id: 9, location_name: "Kağıthane" },
    { location_id: 10, location_name: "Kartal" },
    { location_id: 11, location_name: "Maltepe" },
    { location_id: 12, location_name: "Pendik" },
    { location_id: 13, location_name: "Sarıyer" },
    { location_id: 14, location_name: "Şişli" },
    { location_id: 15, location_name: "Ümraniye" },
    { location_id: 16, location_name: "Üsküdar" },
    { location_id: 17, location_name: "Zeytinburnu" },
  ]);

  await knex("club_types").insert([
    { club_type_id: 1, club_type_name: "Özel" },
    { club_type_id: 2, club_type_name: "Devlet / Belediye / Okul" },
    { club_type_id: 3, club_type_name: "Rezidans / Site / Konut" },
  ]);

  await knex("player_levels").insert([
    { player_level_id: 1, player_level_name: "beginner" },
    { player_level_id: 2, player_level_name: "intermediate" },
    { player_level_id: 3, player_level_name: "advanced" },
    { player_level_id: 4, player_level_name: "professional" },
  ]);

  await knex("trainer_experience_types").insert([
    {
      trainer_experience_type_id: 1,
      trainer_experience_type_name: "beginner",
    },
    {
      trainer_experience_type_id: 2,
      trainer_experience_type_name: "intermediate",
    },
    { trainer_experience_type_id: 3, trainer_experience_type_name: "advanced" },
    {
      trainer_experience_type_id: 4,
      trainer_experience_type_name: "professional",
    },
  ]);

  await knex("court_structure_types").insert([
    {
      court_structure_type_id: 1,
      court_structure_type_name: "indoor",
    },
    {
      court_structure_type_id: 2,
      court_structure_type_name: "outdoor",
    },
    {
      court_structure_type_id: 3,
      court_structure_type_name: "convertible",
    },
  ]);

  await knex("court_surface_types").insert([
    {
      court_surface_type_id: 1,
      court_surface_type_name: "hard",
    },
    {
      court_surface_type_id: 2,
      court_surface_type_name: "clay",
    },
    {
      court_surface_type_id: 3,
      court_surface_type_name: "grass",
    },
    {
      court_surface_type_id: 4,
      court_surface_type_name: "carpet",
    },
  ]);

  await knex("user_types").insert([
    { user_type_id: 1, user_type_name: "player" },
    { user_type_id: 2, user_type_name: "trainer" },
    { user_type_id: 3, user_type_name: "club" },
    { user_type_id: 4, user_type_name: "club_staff" },
  ]);

  await knex("user_status_types").insert([
    { user_status_type_id: 1, user_status_type_name: "active" },
    { user_status_type_id: 2, user_status_type_name: "paused" },
    { user_status_type_id: 3, user_status_type_name: "deleted" },
    { user_status_type_id: 4, user_status_type_name: "banned" },
  ]);

  await knex("event_types").insert([
    { event_type_id: 1, event_type_name: "training" },
    { event_type_id: 2, event_type_name: "match" },
    { event_type_id: 3, event_type_name: "lesson" },
    { event_type_id: 4, event_type_name: "external" },
  ]);

  await knex("club_staff_role_types").insert([
    {
      club_staff_role_type_id: 1,
      club_staff_role_type_name: "admin",
    },
  ]);

  await knex("club_staff_employment_types").insert([
    {
      club_staff_employment_type_id: 1,
      club_staff_employment_type_name: "full_time",
    },
    {
      club_staff_employment_type_id: 2,
      club_staff_employment_type_name: "part_time",
    },
  ]);

  await knex("permission_types").insert([
    { permission_type_id: 1, permission_type_name: "read_only" },
    { permission_type_id: 2, permission_type_name: "read_add" },
    { permission_type_id: 3, permission_type_name: "read_update" },
    { permission_type_id: 4, permission_type_name: "read_delete" },
    { permission_type_id: 5, permission_type_name: "crud" },
  ]);

  await knex("booking_status_types").insert([
    { booking_status_type_id: 1, booking_status_type_name: "pending" },
    { booking_status_type_id: 2, booking_status_type_name: "confirmed" },
    { booking_status_type_id: 3, booking_status_type_name: "rejected" },
    { booking_status_type_id: 4, booking_status_type_name: "cancelled" },
  ]);

  await knex("users").insert([
    {
      user_id: 1,
      email: "user1@user.com",
      password: "1234",
      registered_at: "2023-07-15",
      user_type_id: 1,
      user_status_type_id: 1,
    },
    {
      user_id: 2,
      email: "user2@user.com",
      password: "1234",
      registered_at: "2023-07-15",
      user_type_id: 1,
      user_status_type_id: 1,
    },
    {
      user_id: 3,
      email: "user3@user.com",
      password: "1234",
      registered_at: "2023-07-15",
      user_type_id: 2,
      user_status_type_id: 1,
    },
    {
      user_id: 4,
      email: "user4@user.com",
      password: "1234",
      registered_at: "2023-07-15",
      user_type_id: 3,
      user_status_type_id: 1,
    },
    {
      user_id: 5,
      email: "user5@user.com",
      password: "1234",
      registered_at: "2023-07-15",
      user_type_id: 4,
      user_status_type_id: 1,
    },
  ]);

  await knex("players").insert([
    {
      player_id: 1,
      fname: "Ahmet",
      lname: "Boncuklu",
      birth_year: "1990",
      gender: "male",
      location_id: 1,
      player_level_id: 1,
      user_id: 1,
    },
    {
      player_id: 2,
      fname: "Hüsnü",
      lname: "Sihibraz",
      birth_year: "1995",
      gender: "male",
      location_id: 5,
      player_level_id: 2,
      user_id: 2,
    },
  ]);

  await knex("clubs").insert([
    {
      club_id: 1,
      club_name: "TED",
      location_id: 4,
      club_type_id: 1,
      user_id: 4,
    },
  ]);

  await knex("trainers").insert([
    {
      trainer_id: 1,
      fname: "Osman",
      lname: "Kobalt",
      birth_year: "1980",
      gender: "female",
      price_hour: 150,
      club_id: 1,
      trainer_experience_type_id: 1,
      location_id: 1,
      trainer_employment_type_id: 2,
      user_id: 3,
    },
  ]);

  await knex("club_staff").insert([
    {
      club_staff_id: 1,
      fname: "Deniz",
      lname: "Kalyoncu",
      birth_year: "1992",
      gender: "female",
      gross_salary_month: 30000,
      club_id: 1,
      club_staff_employment_type_id: 1,
      club_staff_role_type_id: 1,
      user_id: 5,
    },
  ]);

  await knex("permissions").insert([
    {
      permission_id: 1,
      registered_at: "2023-07-15",
      permission_type_id: 1,
      club_id: 1,
      club_staff_id: 1,
    },
  ]);

  await knex("club_external_members").insert([
    {
      club_external_member_id: 1,
      fname: "Ayşe",
      lname: "Kara",
      birth_year: "1970",
      gender: "female",
      club_id: 1,
    },
  ]);

  await knex("courts").insert([
    {
      court_id: 1,
      court_name: "Merkez",
      registered_at: "2023-07-15",
      opening_time: 800,
      closing_time: 900,
      price_hour: 150,
      court_structure_type_id: 1,
      court_surface_type_id: 1,
      club_id: 1,
    },
  ]);

  await knex("bookings").insert([
    {
      booking_id: 1,
      registered_at: "2023-07-15",
      booking_status_type_id: 1,
      event_date: "2023-07-16",
      event_time: "20:00",
      event_type_id: 1,
      club_id: 1,
      court_id: 1,
      inviter_id: 1,
      invitee_id: 2,
    },
  ]);
}
