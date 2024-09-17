import React from "react";
import PlayerRequets from "./player/PlayerRequets";
import TrainerRequests from "./trainer/TrainerRequests";
import { useAppSelector } from "../../store/hooks";
import { useGetUserTypesQuery } from "../../../api/endpoints/UserTypesApi";

const Requests = () => {
  const user = useAppSelector((store) => store.user);

  const { data: userTypes, isLoading: isUserTypesLoading } =
    useGetUserTypesQuery({});

  let userType = "";

  if (userTypes && user) {
    userType = userTypes?.find(
      (type) => type.user_type_id === user.user.user.user_type_id
    )?.user_type_name;
  }
  return (
    <div>
      {userType === "player" && <PlayerRequets />}
      {userType === "trainer" && <TrainerRequests />}
    </div>
  );
};

export default Requests;
