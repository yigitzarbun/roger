import React from "react";

import { useAppSelector } from "../../store/hooks";

import ClubPayments from "./club/ClubPayments";
import PlayerPayments from "./player/PlayerPayments";
import TrainerPayments from "./trainer/TrainerPayments";

const Payments = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const isUserPlayer = user?.user?.user_type_id === 1;
  const isUserTrainer = user?.user?.user_type_id === 2;
  const isUserClub = user?.user?.user_type_id === 3;

  return (
    <div>
      {isUserPlayer && <PlayerPayments />}
      {isUserTrainer && <TrainerPayments />}
      {isUserClub && <ClubPayments />}
    </div>
  );
};

export default Payments;
