import React from "react";

import { useAppSelector } from "../../store/hooks";

import PlayerEvents from "./player/PlayerEvents";

const Events = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const isUserPlayer = user?.user?.user_type_id === 1;

  return <div>{isUserPlayer && <PlayerEvents />}</div>;
};
export default Events;
