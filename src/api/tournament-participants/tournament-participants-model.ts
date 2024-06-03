const db = require("../../data/dbconfig");

const tournamentParticipantsModel = {
  async getAll() {
    const tournamentParticipants = await db("tournament_participants");
    return tournamentParticipants;
  },
  async getById(tournamentParticipantId) {
    const participant = await db("tournament_participants").where(
      "tournament_participant_id",
      tournamentParticipantId
    );
    return participant;
  },
  async getPaginatedPlayerActiveTournaments(filter) {
    const tournamentsPerPage = 4;
    const offset = (filter.currentPage - 1) * tournamentsPerPage;
    const today = new Date();
    try {
      const paginatedPlayerActiveTournaments = await db
        .select(
          "tournament_participants.*",
          "clubs.club_name",
          "locations.location_name",
          db.raw(
            "COUNT(DISTINCT tournament_participants.tournament_participant_id) as participant_count"
          )
        )
        .from("tournament_participants")
        .leftJoin(
          "tournaments",
          "tournaments.tournament_id",
          "tournament_participants.tournament_id"
        )
        .leftJoin("clubs", "clubs.user_id", "tournaments.club_user_id")
        .leftJoin("locations", "locations.location_id", "clubs.location_id")
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
          if (filter.clubUserId > 0) {
            builder.where("tournaments.club_user_id", filter.clubUserId);
          }
        })
        .andWhere("tournaments.is_active", true)
        .andWhere("tournament_participants.player_user_id", filter.playerUserId)
        .andWhere("tournaments.end_date", ">", today)
        .groupBy(
          "tournaments.tournament_id",
          "clubs.club_name",
          "locations.location_name",
          "tournament_participants.tournament_participant_id"
        )
        .offset(offset)
        .limit(tournamentsPerPage);

      const count = await db
        .select(
          "tournament_participants.*",
          "clubs.club_name",
          "locations.location_name",
          db.raw(
            "COUNT(DISTINCT tournament_participants.tournament_participant_id) as participant_count"
          )
        )
        .from("tournament_participants")
        .leftJoin(
          "tournaments",
          "tournaments.tournament_id",
          "tournament_participants.tournament_id"
        )
        .leftJoin("clubs", "clubs.user_id", "tournaments.club_user_id")
        .leftJoin("locations", "locations.location_id", "clubs.location_id")
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
          if (filter.clubUserId > 0) {
            builder.where("tournaments.club_user_id", filter.clubUserId);
          }
        })
        .andWhere("tournaments.is_active", true)
        .andWhere("tournament_participants.player_user_id", filter.playerUserId)
        .andWhere("tournaments.end_date", ">", today)
        .groupBy(
          "tournaments.tournament_id",
          "clubs.club_name",
          "locations.location_name",
          "tournament_participants.tournament_participant_id"
        );

      const total = parseInt(count[0].total, 10);
      const totalPages = Math.ceil(total / tournamentsPerPage);

      const data = {
        tournaments: paginatedPlayerActiveTournaments,
        totalPages: totalPages,
      };

      return data;
    } catch (error) {
      console.log("Error fetching player active tournaments: ", error);
    }
  },
  async add(participant) {
    const [newParticipant] = await db("tournament_participants")
      .insert(participant)
      .returning("*");
    return newParticipant;
  },
  async update(updates) {
    return await db("tournament_participants")
      .where("tournament_participant_id", updates.tournament_participant_id)
      .update(updates);
  },
};

export default tournamentParticipantsModel;
