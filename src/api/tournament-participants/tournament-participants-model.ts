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
  async getByFilter(filter) {
    try {
      const participants = await db("tournament_participants").where(
        (builder) => {
          if (filter.is_active) {
            builder.where("tournament_participants.is_active", true);
          }
          if (filter.tournament_id) {
            builder.where(
              "tournament_participants.tournament_id",
              filter.tournament_id
            );
          }
          if (filter.player_user_id) {
            builder.where(
              "tournament_participants.player_user_id",
              filter.player_user_id
            );
          }
        }
      );
      return participants;
    } catch (error) {
      console.log("Try fetching tournament participants by filter: ", error);
    }
  },
  async getPaginatedPlayerActiveTournaments(filter) {
    const tournamentsPerPage = 4;
    const offset = (filter.currentPage - 1) * tournamentsPerPage;
    const today = new Date();

    try {
      const paginatedTournaments = await db
        .select(
          "tournaments.tournament_id",
          "tournaments.tournament_name",
          "tournaments.start_date",
          "tournaments.end_date",
          "tournaments.application_deadline",
          "tournaments.tournament_gender",
          "tournaments.club_subscription_required",
          "tournaments.min_birth_year",
          "tournaments.max_birth_year",
          "clubs.club_name",
          "tournaments.application_fee",
          "locations.location_name",
          "tournament_participants.tournament_participant_id",
          db.raw(`
      (SELECT COUNT(DISTINCT tournament_participants.player_user_id)
       FROM tournament_participants
       WHERE tournament_participants.tournament_id = tournaments.tournament_id
         AND tournament_participants.is_active = true)
         as participant_count`)
        )
        .from("tournament_participants")
        .leftJoin("tournaments", function () {
          this.on(
            "tournament_participants.tournament_id",
            "=",
            "tournaments.tournament_id"
          );
        })
        .leftJoin("clubs", "tournaments.club_user_id", "clubs.user_id")
        .leftJoin("locations", "clubs.location_id", "locations.location_id")
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
        .andWhere("tournaments.end_date", ">=", today)
        .andWhere((builder) => {
          builder
            .where(
              "tournament_participants.player_user_id",
              filter.playerUserId
            )
            .andWhere("tournament_participants.is_active", true);
        })
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
          "tournaments.tournament_id",
          "tournaments.tournament_name",
          "tournaments.start_date",
          "tournaments.end_date",
          "clubs.club_name",
          "locations.location_name",
          db.raw(`
      (SELECT COUNT(DISTINCT tournament_participants.player_user_id)
       FROM tournament_participants
       WHERE tournament_participants.tournament_id = tournaments.tournament_id
         AND tournament_participants.is_active = true)
         as participant_count`)
        )
        .from("tournament_participants")
        .leftJoin("tournaments", function () {
          this.on(
            "tournament_participants.tournament_id",
            "=",
            "tournaments.tournament_id"
          );
        })
        .leftJoin("clubs", "tournaments.club_user_id", "clubs.user_id")
        .leftJoin("locations", "clubs.location_id", "locations.location_id")
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
        .andWhere("tournaments.end_date", ">=", today)
        .andWhere((builder) => {
          builder
            .where(
              "tournament_participants.player_user_id",
              filter.playerUserId
            )
            .andWhere("tournament_participants.is_active", true);
        })
        .groupBy(
          "tournaments.tournament_id",
          "clubs.club_name",
          "locations.location_name",
          "tournament_participants.tournament_participant_id"
        );

      // Extract the total count from the result
      const totalPages = Math.ceil(count / tournamentsPerPage);

      const data = {
        tournaments: paginatedTournaments,
        totalPages: totalPages > 0 ? totalPages : 0,
      };

      return data;
    } catch (error) {
      console.error("Error fetching player active tournaments: ", error);
      throw error;
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
