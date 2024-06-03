const db = require("../../data/dbconfig");

const tournamentsModel = {
  async getAll() {
    const tournaments = await db("tournaments");
    return tournaments;
  },
  async getById(tournamentId) {
    const tournament = await db("tournaments").where(
      "tournament_id",
      tournamentId
    );
    return tournament;
  },
  async getByClubUserId(clubUserId: number) {
    try {
      const tournaments = await db
        .select(
          "tournaments.*",
          db.raw(
            "COUNT(DISTINCT tournament_participants.tournament_participant_id) as participant_count"
          )
        )
        .from("tournaments")
        .leftJoin("tournament_participants", function () {
          this.on(
            "tournament_participants.tournament_id",
            "=",
            "tournaments.tournament_id"
          );
        })
        .where("club_user_id", clubUserId)
        .groupBy("tournaments.tournament_id");
      return tournaments;
    } catch (error) {
      console.log("Error fetching tournaments by club user id: ", error);
    }
  },
  async getPaginatedTournaments(filter) {
    const tournamentsPerPage = 4;
    const offset = (filter.currentPage - 1) * tournamentsPerPage;
    const today = new Date(); // Get today's date

    try {
      const paginatedTournaments = await db
        .select(
          "tournaments.*",
          "clubs.club_name",
          "locations.location_name",
          db.raw(
            "COUNT(DISTINCT tournament_participants.tournament_participant_id) as participant_count"
          )
        )
        .from("tournaments")
        .leftJoin("clubs", "clubs.user_id", "tournaments.club_user_id")
        .leftJoin("locations", "locations.location_id", "clubs.location_id")
        .leftJoin(
          "tournament_participants",
          "tournament_participants.tournament_id",
          "tournaments.tournament_id"
        )
        .where((builder) => {
          if (filter.textSearch && filter.textSearch !== "") {
            builder
              .where("clubs.club_name", "ilike", `%${filter.textSearch}%`)
              .orWhere(
                "tournaments.tournament_name",
                "ilike",
                `%${filter.textSearch}%`
              );
          }
          if (filter.locationId > 0) {
            builder.where("locations.location_id", filter.locationId);
          }
          if (filter.gender !== "") {
            builder.where("tournaments.tournament_gender", filter.gender);
          }
          if (filter.clubUserId > 0) {
            builder.where("tournaments.club_user_id", filter.clubUserId);
          }
          if (filter.subscriptionRequired !== "null") {
            builder.where(
              "tournaments.club_subscription_required",
              filter.subscriptionRequired
            );
          }
        })
        .andWhere("tournaments.is_active", true)
        .andWhere("tournaments.end_date", ">", today) // Compare end_date with today's date
        .groupBy(
          "tournaments.tournament_id",
          "clubs.club_name",
          "locations.location_name"
        )
        .offset(offset)
        .limit(tournamentsPerPage);

      const countResult = await db("tournaments")
        .countDistinct("tournaments.tournament_id as total")
        .leftJoin("clubs", "clubs.user_id", "tournaments.club_user_id")
        .leftJoin("locations", "locations.location_id", "clubs.location_id")
        .leftJoin(
          "tournament_participants",
          "tournament_participants.tournament_id",
          "tournaments.tournament_id"
        )
        .where((builder) => {
          if (filter.textSearch && filter.textSearch !== "") {
            builder
              .where("clubs.club_name", "ilike", `%${filter.textSearch}%`)
              .orWhere(
                "tournaments.tournament_name",
                "ilike",
                `%${filter.textSearch}%`
              );
          }
          if (filter.locationId > 0) {
            builder.where("locations.location_id", filter.locationId);
          }
          if (filter.gender !== "") {
            builder.where("tournaments.tournament_gender", filter.gender);
          }
          if (filter.clubUserId > 0) {
            builder.where("tournaments.club_user_id", filter.clubUserId);
          }
          if (filter.subscriptionRequired !== "null") {
            builder.where(
              "tournaments.club_subscription_required",
              filter.subscriptionRequired
            );
          }
        })
        .andWhere("tournaments.is_active", true)
        .andWhere("tournaments.end_date", ">", today);

      const total = parseInt(countResult[0].total, 10);
      const totalPages = Math.ceil(total / tournamentsPerPage);

      const data = {
        tournaments: paginatedTournaments,
        totalPages: totalPages,
      };

      return data;
    } catch (error) {
      console.log("Error fetching paginated tournaments: ", error);
    }
  },
  async add(tournament) {
    const [newTournament] = await db("tournaments")
      .insert(tournament)
      .returning("*");
    return newTournament;
  },
  async update(updates) {
    return await db("tournaments")
      .where("tournament_id", updates.tournament_id)
      .update(updates);
  },
};

export default tournamentsModel;
