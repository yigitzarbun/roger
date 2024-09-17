import { Request, Response, NextFunction } from "express";
import bookingsModel from "./bookings-model";
import usersModel from "../users/users-model";
import clubsModel from "../clubs/clubs-model";
import courtsModel from "../courts/courts-model";
import playersModel from "../players/players-model";
import trainersModel from "../trainers/trainers-model";
import clubSubscriptionsModel from "../club-subscriptions/club-subscriptions-model";
import clubStaffModel from "../club-staff/club-staff-model";

export const essentialRequirementsMet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    booking_status_type_id,
    club_id,
    court_id,
    court_price,
    event_date,
    event_time,
    event_type_id,
    invitee_id,
    inviter_id,
    lesson_price,
    payment_id,
  } = req.body;
  const invitee = await usersModel.getById(Number(invitee_id));
  const inviter = await usersModel.getById(Number(inviter_id));
  const club = await clubsModel.getByClubId(Number(club_id));
  const clubUser = await usersModel.getById(Number(club?.[0]?.user_id));
  const court = await courtsModel.getById(Number(court_id));

  const inviterActive = inviter?.[0]?.user_status_type_id === 1;
  const inviteeActive = invitee?.[0]?.user_status_type_id === 1;

  const isInviterPlayer = inviter?.[0]?.user_type_id === 1;
  const isInviteePlayer = invitee?.[0]?.user_type_id === 1;
  const isInviterTrainer = inviter?.[0]?.user_type_id === 2;
  const isInviteeTrainer = invitee?.[0]?.user_type_id === 2;

  let inviterPaymentDetailsExist = isInviterPlayer
    ? await playersModel.playerPaymentDetailsExist(inviter_id)
    : isInviterTrainer
    ? trainersModel.trainerPaymentDetailsExist(inviter_id)
    : true;
  let inviteePaymentDetailsExist = isInviteePlayer
    ? await playersModel.playerPaymentDetailsExist(invitee_id)
    : isInviteeTrainer
    ? trainersModel.trainerPaymentDetailsExist(invitee_id)
    : true;

  const inviterAvailable = await bookingsModel.getByFilter({
    event_date: event_date,
    event_time: event_time,
    booking_status_type_id: 2,
    user_id: inviter_id,
  });

  const inviteeAvailable = await bookingsModel.getByFilter({
    event_date: event_date,
    event_time: event_time,
    booking_status_type_id: 2,
    user_id: invitee_id,
  });

  const clubActive = clubUser?.[0]?.user_status_type_id === 1;

  const clubPaymentDetailsExist = await clubsModel.clubPaymentDetailsExist(
    club?.[0]?.user_id
  );

  const courtActive = court?.[0]?.is_active;

  const courtAvailable = await bookingsModel.getByFilter({
    event_date: event_date,
    event_time: event_time,
    court_id: court_id,
    booking_status_type_id: 2,
  });

  if (
    inviterActive &&
    inviteeActive &&
    inviterPaymentDetailsExist &&
    inviteePaymentDetailsExist &&
    inviterAvailable?.length === 0 &&
    inviteeAvailable?.length === 0 &&
    clubActive &&
    clubPaymentDetailsExist &&
    courtActive &&
    courtAvailable?.length === 0
  ) {
    next();
  } else {
    res
      .status(400)
      .json({ message: "Booking essential conditions are not met" });
  }
};

export const trainingAndMatchConditionsMet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    booking_status_type_id,
    club_id,
    court_id,
    court_price,
    event_date,
    event_time,
    event_type_id,
    invitee_id,
    inviter_id,
    lesson_price,
    payment_id,
  } = req.body;

  const club = await clubsModel.getByClubId(Number(club_id));

  const clubRequiresSubscription = club?.[0]?.is_player_subscription_required;

  const isInviterSubscribed = await clubSubscriptionsModel.getByFilter({
    club_id: club?.[0]?.user_id,
    player_id: inviter_id,
    is_active: true,
  });

  const isInviteeSubscribed = await clubSubscriptionsModel.getByFilter({
    club_id: club?.[0]?.user_id,
    player_id: invitee_id,
    is_active: true,
  });

  const isEventTrainingOrMatch = event_type_id === 1 || event_type_id === 2;

  if (!clubRequiresSubscription || !isEventTrainingOrMatch) {
    next();
  } else if (
    clubRequiresSubscription &&
    isInviterSubscribed?.length > 0 &&
    isInviteeSubscribed?.length > 0 &&
    isEventTrainingOrMatch
  ) {
    next();
  } else {
    res.status(400).json({
      message: "Booking player subscriptions conditions are not met",
    });
  }
};

export const lessonConditionsMet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    booking_status_type_id,
    club_id,
    court_id,
    court_price,
    event_date,
    event_time,
    event_type_id,
    invitee_id,
    inviter_id,
    lesson_price,
    payment_id,
  } = req.body;

  const club = await clubsModel.getByClubId(Number(club_id));
  const invitee = await usersModel.getById(Number(invitee_id));
  const inviter = await usersModel.getById(Number(inviter_id));

  const isInviterPlayer = inviter?.[0]?.user_type_id === 1;
  const isInviteePlayer = invitee?.[0]?.user_type_id === 1;
  const isInviterTrainer = inviter?.[0]?.user_type_id === 2;
  const isInviteeTrainer = invitee?.[0]?.user_type_id === 2;

  const clubRequiresPlayerSubscription =
    club?.[0]?.is_player_lesson_subscription_required;

  const clubRequiresTrainerStaff = club?.[0]?.is_trainer_subscription_required;

  const isPlayerSubscribed = await clubSubscriptionsModel.getByFilter({
    club_id: club?.[0]?.user_id,
    player_id: isInviterPlayer
      ? inviter_id
      : isInviteePlayer
      ? invitee_id
      : null,
    is_active: true,
  });

  const isTrainerStaff = await clubStaffModel.isTrainerClubStaff({
    clubId: club_id,
    trainerUserId: isInviterTrainer
      ? inviter_id
      : isInviteeTrainer
      ? invitee_id
      : null,
  });

  const isEventLesson = event_type_id === 3;

  if (
    (isEventLesson &&
      !clubRequiresPlayerSubscription &&
      !clubRequiresTrainerStaff) ||
    (isEventLesson &&
      clubRequiresPlayerSubscription &&
      isPlayerSubscribed?.length > 0 &&
      clubRequiresTrainerStaff &&
      isTrainerStaff?.length > 0) ||
    (isEventLesson &&
      clubRequiresPlayerSubscription &&
      isPlayerSubscribed?.length > 0 &&
      !clubRequiresTrainerStaff) ||
    (isEventLesson &&
      !clubRequiresPlayerSubscription &&
      isTrainerStaff?.length > 0 &&
      clubRequiresTrainerStaff)
  ) {
    next();
  } else if (!isEventLesson) {
    next();
  } else {
    res.status(400).json({
      message: "Booking lesson conditions are not met",
    });
  }
};
