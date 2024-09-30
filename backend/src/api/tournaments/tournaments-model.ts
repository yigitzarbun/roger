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
  async getParticipantCountByTournamentId(tournamentId: number) {
    try {
      const participants = await db
        .select(
          db.raw(
            "COUNT(DISTINCT CASE WHEN tournament_participants.is_active = true THEN tournament_participants.tournament_participant_id END) as participant_count"
          )
        )
        .from("tournaments")
        .leftJoin(
          "tournament_participants",
          "tournament_participants.tournament_id",
          "tournaments.tournament_id"
        )
        .where("tournaments.tournament_id", tournamentId);

      return participants;
    } catch (error) {
      console.log("Error fetching getParticipantCountByTournamentId: ", error);
    }
  },
  async getTournamentDetails(filter) {
    const playersPerPage = 4;
    const offset = (filter.currentPage - 1) * playersPerPage;

    try {
      // Fetching tournament details along with participant count
      const tournamentDetails = await db
        .select(
          "tournaments.tournament_id",
          "tournaments.is_active as tournament_is_active",
          "tournaments.tournament_name",
          "tournaments.start_date",
          "tournaments.end_date",
          "tournaments.application_deadline",
          "tournaments.min_birth_year",
          "tournaments.max_birth_year",
          "tournaments.tournament_gender",
          "tournaments.application_fee",
          "tournaments.club_subscription_required",
          "tournaments.max_players",
          "clubs.user_id as club_user_id",
          "clubs.club_name as club_name",
          "clubs.club_address",
          "clubs.club_id as club_club_id",
          "locations.location_name",
          db.raw(
            "COUNT(DISTINCT CASE WHEN tournament_participants.is_active = true THEN tournament_participants.tournament_participant_id END) as participant_count"
          )
        )
        .from("tournaments")
        .leftJoin(
          "tournament_participants",
          "tournament_participants.tournament_id",
          "tournaments.tournament_id"
        )
        .leftJoin("clubs", "clubs.user_id", "tournaments.club_user_id")
        .leftJoin("locations", "locations.location_id", "clubs.location_id")
        .leftJoin("users", "users.user_id", "tournaments.club_user_id")
        .where("tournaments.tournament_id", Number(filter.tournamentId))
        .andWhere("tournaments.is_active", true)
        .andWhere("users.user_status_type_id", 1)
        .groupBy(
          "tournaments.tournament_id",
          "tournaments.is_active",
          "tournaments.tournament_name",
          "tournaments.start_date",
          "tournaments.end_date",
          "tournaments.application_deadline",
          "tournaments.min_birth_year",
          "tournaments.max_birth_year",
          "tournaments.tournament_gender",
          "tournaments.application_fee",
          "tournaments.club_subscription_required",
          "tournaments.max_players",
          "clubs.user_id",
          "clubs.club_name",
          "clubs.club_address",
          "clubs.club_id",
          "locations.location_name"
        )
        .first(); // Use first() to get a single tournament detail

      // Fetching paginated players for the tournament
      const players = await db
        .select(
          "players.user_id as player_user_id",
          "players.fname",
          "players.lname",
          "players.birth_year",
          "players.gender",
          "player_levels.player_level_name",
          "player_levels.player_level_id",
          "players.image",
          db.raw(
            "COUNT(CASE WHEN (bookings.event_type_id = 2 OR bookings.event_type_id = 7) AND bookings.booking_status_type_id = 5 AND match_scores.match_score_status_type_id = 3 THEN match_scores.match_score_id ELSE NULL END) as totalMatches"
          ),
          db.raw(
            "SUM(CASE WHEN (bookings.event_type_id = 2 OR bookings.event_type_id = 7) AND match_scores.match_score_status_type_id = 3 AND match_scores.winner_id = players.user_id THEN 1 ELSE 0 END) as wonMatches"
          ),
          db.raw(
            "SUM(CASE WHEN (bookings.event_type_id = 2 OR bookings.event_type_id = 7) AND match_scores.match_score_status_type_id = 3 AND match_scores.winner_id != players.user_id THEN 1 ELSE 0 END) as lostMatches"
          ),
          db.raw(
            "SUM(CASE WHEN (bookings.event_type_id = 2 OR bookings.event_type_id = 7) AND match_scores.match_score_status_type_id = 3 AND match_scores.winner_id = players.user_id THEN 3 ELSE 0 END) as playerPoints"
          )
        )
        .from("tournament_participants")
        .leftJoin(
          "players",
          "players.user_id",
          "tournament_participants.player_user_id"
        )
        .leftJoin(
          "player_levels",
          "player_levels.player_level_id",
          "players.player_level_id"
        )
        .leftJoin("users", "users.user_id", "players.user_id")
        .leftJoin("bookings", function () {
          this.on("players.user_id", "=", "bookings.inviter_id")
            .orOn("players.user_id", "=", "bookings.invitee_id")
            .andOn("bookings.event_type_id", 2);
        })
        .leftJoin(
          "match_scores",
          "match_scores.booking_id",
          "=",
          "bookings.booking_id"
        )
        .where((builder) => {
          if (filter.textSearch && filter.textSearch !== "") {
            builder
              .where("players.fname", "ilike", `%${filter.textSearch}%`)
              .orWhere("players.lname", "ilike", `%${filter.textSearch}%`);
          }
          if (filter.playerLevelId && filter.playerLevelId !== "null") {
            builder.where("players.player_level_id", filter.playerLevelId);
          }
        })
        .andWhere(
          "tournament_participants.tournament_id",
          Number(filter.tournamentId)
        )
        .andWhere("users.user_status_type_id", 1)
        .andWhere("tournament_participants.is_active", true)
        .groupBy(
          "players.user_id",
          "players.fname",
          "players.lname",
          "players.birth_year",
          "players.gender",
          "player_levels.player_level_name",
          "player_levels.player_level_id",
          "players.image"
        )
        .as("player_data")
        .orderByRaw(
          "SUM(CASE WHEN bookings.event_type_id = 2 AND match_scores.match_score_status_type_id = 3 AND match_scores.winner_id = players.user_id THEN 3 ELSE 0 END) DESC"
        )
        .offset(offset)
        .limit(playersPerPage);

      // Fetching the total count of players for pagination
      const totalPlayersResult = await db("tournament_participants")
        .countDistinct("players.user_id as total")
        .leftJoin(
          "players",
          "players.user_id",
          "tournament_participants.player_user_id"
        )
        .leftJoin("users", "users.user_id", "players.user_id")
        .where("tournament_participants.tournament_id", filter.tournamentId)
        .andWhere("users.user_status_type_id", 1)
        .andWhere("tournament_participants.is_active", true)
        .first();

      const totalPlayers = parseInt(totalPlayersResult.total, 10);
      const totalPages = Math.ceil(totalPlayers / playersPerPage);

      const data = {
        tournament: tournamentDetails,
        players: players,
        totalPages: totalPages,
      };

      return data;
    } catch (error) {
      console.log("Error fetching tournament details: ", error);
      throw error; // Rethrow the error for further handling if needed
    }
  },
  async getByClubUserId(clubUserId) {
    const today = new Date();

    try {
      const tournaments = await db
        .select(
          "tournaments.*",
          db.raw(
            "COUNT(DISTINCT CASE WHEN tournament_participants.is_active = true THEN tournament_participants.tournament_participant_id END) as participant_count"
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
        .where("tournaments.club_user_id", clubUserId)
        .andWhere("tournaments.is_active", true)
        .andWhere("tournaments.end_date", ">=", today)
        .groupBy("tournaments.tournament_id");
      return tournaments;
    } catch (error) {
      console.log("Error fetching tournaments by club user id: ", error);
    }
  },
  async getPaginatedTournaments(filter) {
    const tournamentsPerPage = 4;
    const offset = (filter.currentPage - 1) * tournamentsPerPage;
    const today = new Date();
    try {
      const paginatedTournaments = await db
        .select(
          "tournaments.*",
          "clubs.club_name",
          "clubs.user_id as clubUserId",
          "locations.location_name",
          db.raw(
            "COUNT(DISTINCT tournament_participants.tournament_participant_id) as participant_count"
          ),
          db.raw(
            `MAX(CASE WHEN tournament_participants.is_active = true AND tournament_participants.player_user_id = ? THEN 'playerParticipantTrue' ELSE 'playerParticipantFalse' END) as player_participation_status`,
            [filter.player_user_id]
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
        .andWhere("tournaments.end_date", ">=", today) // Compare end_date with today's date
        .groupBy(
          "tournaments.tournament_id",
          "clubs.club_name",
          "locations.location_name",
          "clubs.user_id"
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
        .andWhere("tournaments.end_date", ">=", today);

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
