import { Request, Response, NextFunction } from "express";
import studentsModel from "./students-model";
import usersModel from "../users/users-model";

export const studentRequirementsMet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { trainer_id, player_id, student_status } = req.body;
  const player = await usersModel.getById(player_id);
  const trainer = await usersModel.getById(trainer_id);
  const isPlayerStudent = await studentsModel.isStudent({
    player_id: player_id,
    trainer_id: trainer_id,
  });
  const isPlayerActive = player?.[0]?.user_status_type_id === 1;
  const isTrainerActive = trainer?.[0]?.user_status_type_id === 1;

  if (isPlayerActive && isTrainerActive && !isPlayerStudent) {
    next();
  } else {
    res.status(400).json({ message: "Adding student conditions are not met" });
  }
};
