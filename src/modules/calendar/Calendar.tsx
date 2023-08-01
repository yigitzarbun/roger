import React from "react";

import PlayerCalendar from "./player/PlayerCalendar";
import TrainerCalendar from "./trainer/TrainerCalendar";
import ClubCalendar from "./club/ClubCalendar";

import { useAppSelector } from "../../store/hooks";

import { useGetUserTypesQuery } from "../../api/endpoints/UserTypesApi";

const Calendar = () => {
  const user = useAppSelector((store) => store.user.user.user);

  const { data: userTypes, isLoading: isUserTypesLoading } =
    useGetUserTypesQuery({});

  const isUserPlayer = user.user_type_id === 1;
  const isUserTrainer = user.user_type_id === 2;
  const isUserClub = user.user_type_id === 3;

  if (isUserTypesLoading) {
    return <div>Yükleniyor..</div>;
  }
  return (
    <div>
      {isUserPlayer && <PlayerCalendar />}
      {isUserTrainer && <TrainerCalendar />}
      {isUserClub && <ClubCalendar />}
    </div>
  );
};
export default Calendar;
