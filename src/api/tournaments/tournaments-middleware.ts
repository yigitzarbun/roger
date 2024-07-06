import { Request, Response, NextFunction } from "express";
import matchScoresModel from "../match-scores/match-scores-model";
import tournamentMatchesModel from "../tournament-matches/tournament-matches-model";

export const missingTournamentMatcheScores = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { tournament_id, is_active } = req.body;

  const missingMatchScores =
    await matchScoresModel.getTournamnetMissingMatchScoresByTournamentId(
      Number(tournament_id)
    );

  const isActiveBoolean =
    typeof is_active === "boolean" ? is_active : is_active === "true";

  if (missingMatchScores?.length > 0 && isActiveBoolean === false) {
    res.status(400).json({
      message: "Cannot delete tournament with missing match scores",
    });
  } else {
    next();
  }
};

export const updatePendingTournamentMatchesAsCancelled = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { tournament_id, is_active } = req.body;

  const isActiveBoolean =
    typeof is_active === "boolean" ? is_active : is_active === "true";

  const pendingTournamentMatches =
    await tournamentMatchesModel.getTournamentPendingTournamentMatchesByTournamentId(
      Number(tournament_id)
    );

  let result;
  if (isActiveBoolean) {
    result = true;
  }
  if (pendingTournamentMatches.length === 0 && isActiveBoolean === false) {
    result = true;
  }
  if (pendingTournamentMatches?.length > 0 && isActiveBoolean === false) {
    result = tournamentMatchesModel.updatePendingTournamentMatchesAsCancelled(
      Number(tournament_id)
    );
  }

  if (result) {
    next();
  } else {
    res.status(400).json({
      message:
        "Cannot delete tournament because there was an error deleting pending tournament matches",
    });
  }
};
