import React from "react";

import PlayerProfile from "./player/PlayerProfile";
import TrainerProfile from "./trainer/TrainerProfile";
import ClubProfile from "./club/ClubProfile";

import { useAppSelector } from "../../store/hooks";

const Profile = () => {
  const user = useAppSelector((store) => store.user.user.user);

  const isUserPlayer = user.user_type_id === 1;
  const isUserTrainer = user.user_type_id === 2;
  const isUserClub = user.user_type_id === 3;

  return (
    <div>
      {isUserPlayer && <PlayerProfile />}
      {isUserTrainer && <TrainerProfile />}
      {isUserClub && <ClubProfile />}
    </div>
  );
};

export default Profile;
