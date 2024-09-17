import React from "react";

import { useAppSelector } from "../../store/hooks";

import PlayerEvents from "./player/PlayerEvents";
import TrainerEvents from "./trainer/TrainerEvents";

const Events = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const isUserPlayer = user?.user?.user_type_id === 1;
  const isUserTrainer = user?.user?.user_type_id === 2;

  return (
    <div>
      {isUserPlayer && <PlayerEvents />}
      {isUserTrainer && <TrainerEvents />}
    </div>
  );
};
export default Events;
