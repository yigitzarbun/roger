import React from "react";

import PlayerCalendar from "./player/PlayerCalendar";
import TrainerCalendar from "./trainer/TrainerCalendar";

import { useAppSelector } from "../../store/hooks";

import { useGetUserTypesQuery } from "../../api/endpoints/UserTypesApi";

const Calendar = () => {
  const user = useAppSelector((store) => store.user.user.user);
  const { data: userTypes, isLoading: isUserTypesLoading } =
    useGetUserTypesQuery({});
  const userType = userTypes?.find(
    (type) => type.user_type_id === user.user_type_id
  )?.user_type_name;
  if (isUserTypesLoading) {
    return <div>Yükleniyor..</div>;
  }
  return (
    <div>
      {userType === "player" && <PlayerCalendar />}
      {userType === "trainer" && <TrainerCalendar />}
    </div>
  );
};
export default Calendar;
