import { Request, Response, NextFunction } from "express";
import usersModel from "../users/users-model";
import clubsModel from "../clubs/clubs-model";
import trainersModel from "../trainers/trainers-model";
import clubStaffModel from "../club-staff/club-staff-model";

export const essentialRequirementsMet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { club_id, user_id } = req.body;
  // club active
  // trainer active
  // is trainer staff
  const trainerUser = await usersModel.getById(Number(user_id));
  const club = await clubsModel.getByClubId(Number(club_id));
  const clubUser = await usersModel.getById(Number(club?.[0]?.user_id));
  const isTrainerAnyClubStaff = await clubStaffModel.isTrainerAnyClubStaff(
    Number(user_id)
  );
  const isTrainerActive = trainerUser?.[0]?.user_status_type_id === 1;
  const isClubActive = clubUser?.[0]?.user_status_type_id === 1;
  const isTrainerStaff = await clubStaffModel.isTrainerClubStaff({
    clubId: club_id,
    trainerUserId: user_id,
  });
  if (
    isTrainerActive &&
    isClubActive &&
    (isTrainerStaff?.length === 0 || !isTrainerStaff) &&
    !isTrainerAnyClubStaff
  ) {
    next();
  } else {
    res.status(400).json({
      message: "Club staff application conditions are not met",
    });
  }
};
