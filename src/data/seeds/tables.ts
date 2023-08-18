import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("favourites").del();
  await knex("payments").del();
  await knex("payment_types").del();
  await knex("club_subscriptions").del();
  await knex("club_subscription_packages").del();
  await knex("club_subscription_types").del();
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
  await knex("club_staff_role_types").del();
  await knex("event_types").del();
  await knex("user_status_types").del();
  await knex("user_types").del();
  await knex("court_surface_types").del();
  await knex("court_structure_types").del();
  await knex("trainer_experience_types").del();
  await knex("player_levels").del();
  await knex("club_types").del();
  await knex("banks").del();
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

  await knex("banks").insert([
    {
      bank_id: 1,
      bank_name: "Halkbank",
    },
    {
      bank_id: 2,
      bank_name: "VakıfBank",
    },
    {
      bank_id: 3,
      bank_name: "Ziraat Bankası",
    },
    {
      bank_id: 4,
      bank_name: "Akbank",
    },
    {
      bank_id: 5,
      bank_name: "Fibabanka",
    },
    {
      bank_id: 6,
      bank_name: "Şekerbank",
    },
    {
      bank_id: 7,
      bank_name: "Türkiye İş Bankası",
    },
    {
      bank_id: 8,
      bank_name: "Yapı Kredi",
    },
    {
      bank_id: 9,
      bank_name: "DenizBank",
    },
    {
      bank_id: 10,
      bank_name: "Garanti BBVA",
    },
    {
      bank_id: 11,
      bank_name: "HSBC",
    },
    {
      bank_id: 12,
      bank_name: "ICBC Turkey Bank",
    },
    {
      bank_id: 13,
      bank_name: "ING",
    },
    {
      bank_id: 14,
      bank_name: "Odeabank",
    },
    {
      bank_id: 15,
      bank_name: "QNB Finansbank",
    },
    {
      bank_id: 16,
      bank_name: "TEB",
    },
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
      trainer_experience_type_name: "0-2 sene",
    },
    {
      trainer_experience_type_id: 2,
      trainer_experience_type_name: "3-5 sene",
    },
    {
      trainer_experience_type_id: 3,
      trainer_experience_type_name: "6-10 sene",
    },
    {
      trainer_experience_type_id: 4,
      trainer_experience_type_name: "10 sene ve üzeri",
    },
  ]);

  await knex("court_structure_types").insert([
    {
      court_structure_type_id: 1,
      court_structure_type_name: "Kapalı (İç mekan)",
    },
    {
      court_structure_type_id: 2,
      court_structure_type_name: "Açık (Dış mekan)",
    },
    {
      court_structure_type_id: 3,
      court_structure_type_name: "Hibrit (Üstü açılır - kapanır)",
    },
  ]);

  await knex("court_surface_types").insert([
    {
      court_surface_type_id: 1,
      court_surface_type_name: "Sert",
    },
    {
      court_surface_type_id: 2,
      court_surface_type_name: "Toprak",
    },
    {
      court_surface_type_id: 3,
      court_surface_type_name: "Çim",
    },
    {
      court_surface_type_id: 4,
      court_surface_type_name: "Halı",
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
      club_staff_role_type_name: "managerial",
    },
    {
      club_staff_role_type_id: 2,
      club_staff_role_type_name: "trainer",
    },
    {
      club_staff_role_type_id: 3,
      club_staff_role_type_name: "other",
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
    { booking_status_type_id: 5, booking_status_type_name: "completed" },
  ]);

  await knex("club_subscription_types").insert([
    {
      club_subscription_type_id: 1,
      club_subscription_type_name: "1 Aylık Üyelik",
      club_subscription_duration_months: 1,
    },
    {
      club_subscription_type_id: 2,
      club_subscription_type_name: "3 Aylık Üyelik",
      club_subscription_duration_months: 3,
    },
    {
      club_subscription_type_id: 3,
      club_subscription_type_name: "6 Aylık Üyelik",
      club_subscription_duration_months: 6,
    },
    {
      club_subscription_type_id: 4,
      club_subscription_type_name: "12 Aylık Üyelik",
      club_subscription_duration_months: 12,
    },
  ]);

  await knex("payment_types").insert([
    {
      payment_type_id: 1,
      payment_type_name: "training",
    },
    {
      payment_type_id: 2,
      payment_type_name: "match",
    },
    {
      payment_type_id: 3,
      payment_type_name: "lesson",
    },
    {
      payment_type_id: 4,
      payment_type_name: "external",
    },
    {
      payment_type_id: 5,
      payment_type_name: "subscription",
    },
  ]);
}
