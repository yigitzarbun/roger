import React from "react";

import { useAppSelector } from "../../store/hooks";

import PlayerHome from "./player/PlayerHome";
import TrainerHome from "./trainer/TrainerHome";

const Home = () => {
  const { user } = useAppSelector((store) => store.user);
  const isUserPlayer = user?.user?.user_type_id === 1;
  const isUserTrainer = user?.user?.user_type_id === 2;
  const isUserClub = user?.user?.user_type_id === 3;
  return (
    <div>
      {isUserPlayer && <PlayerHome />}
      {isUserTrainer && <TrainerHome />}
    </div>
  );
};

export default Home;
