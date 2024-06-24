const db = require("../../data/dbconfig");

const tournamentMatchesModel = {
  async getAll() {
    const matches = await db("tournament_matches");
    return matches;
  },
  async getById(tournamentMatchId) {
    const match = await db("tournament_matches").where(
      "tournament_match_id",
      tournamentMatchId
    );
    return match;
  },
  async getMatchesByTournamentId(filter) {
    try {
      const tournamentMatches = await db
        .select(
          "tournament_matches.tournament_match_id",
          "tournament_match_rounds.tournament_match_round_name",
          "bookings.event_date",
          "bookings.event_time",
          "bookings.inviter_id",
          "bookings.invitee_id",
          "courts.court_name",
          "tournaments.max_players",
          db.raw(
            "COUNT(DISTINCT CASE WHEN tournament_participants.is_active = true THEN tournament_participants.tournament_participant_id END) as participant_count"
          ),
          db.raw(
            "(SELECT CONCAT(COALESCE(inviter.fname, ''), ' ', COALESCE(inviter.lname, '')) FROM players AS inviter WHERE inviter.user_id = bookings.inviter_id LIMIT 1) AS inviterName"
          ),
          db.raw(
            "(SELECT COALESCE(inviter.image, '') FROM players AS inviter WHERE inviter.user_id = bookings.inviter_id LIMIT 1) AS inviterImage"
          ),
          db.raw(
            "(SELECT CONCAT(COALESCE(invitee.fname, ''), ' ', COALESCE(invitee.lname, '')) FROM players AS invitee WHERE invitee.user_id = bookings.invitee_id LIMIT 1) AS inviteeName"
          ),
          db.raw(
            "(SELECT COALESCE(invitee.image, '') FROM players AS invitee WHERE invitee.user_id = bookings.invitee_id LIMIT 1) AS inviteeImage"
          ),
          "match_scores.*"
        )
        .from("tournament_matches")
        .leftJoin(
          "tournaments",
          "tournaments.tournament_id",
          "tournament_matches.tournament_id"
        )
        .leftJoin(
          "tournament_participants",
          "tournament_participants.tournament_id",
          "tournaments.tournament_id"
        )
        .leftJoin(
          "tournament_match_rounds",
          "tournament_match_rounds.tournament_match_round_id",
          "tournament_matches.tournament_match_round_id"
        )
        .leftJoin(
          "bookings",
          "bookings.booking_id",
          "tournament_matches.booking_id"
        )
        .leftJoin("players", function () {
          this.on("players.user_id", "=", "bookings.inviter_id").orOn(
            "players.user_id",
            "=",
            "bookings.invitee_id"
          );
        })
        .leftJoin(
          "match_scores",
          "match_scores.booking_id",
          "bookings.booking_id"
        )
        .leftJoin("courts", "courts.court_id", "bookings.court_id")
        .where(
          "tournament_match_rounds.tournament_match_round_id",
          filter.matchRoundId
        )
        .andWhere("tournaments.tournament_id", filter.tournamentId)
        .groupBy(
          "tournament_matches.tournament_match_id",
          "tournament_match_rounds.tournament_match_round_name",
          "bookings.event_date",
          "bookings.event_time",
          "courts.court_name",
          "tournaments.max_players",
          "match_scores.match_score_id",
          "bookings.inviter_id",
          "bookings.invitee_id"
        );
      return tournamentMatches;
    } catch (error) {
      console.log("Error fetching getMatchesByTournamentId: ", error);
    }
  },
  async add(tournamentMatch) {
    const [newTournamentMatch] = await db("tournament_matches")
      .insert(tournamentMatch)
      .returning("*");
    return newTournamentMatch;
  },
  async update(updates) {
    return await db("tournament_matches")
      .where("tournament_match_id", updates.tournament_match_id)
      .update(updates);
  },
};

export default tournamentMatchesModel;
