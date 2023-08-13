import React from "react";

import styles from "./styles.module.scss";
import { useAppSelector } from "../../../../store/hooks";
import { useGetFavouritesQuery } from "../../../../api/endpoints/FavouritesApi";

const PlayerSubscriptions = () => {
  const user = useAppSelector((store) => store.user?.user?.user);
  const { data: favourites, isLoading: isFavouritesLoading } =
    useGetFavouritesQuery({});
  const myFavourites = favourites?.filter(
    (favourite) => favourite.favouriter_id === user?.user_id
  )?.length;
  return (
    <div className={styles["player-stats-container"]}>
      <h2>Üyelikler ve Favoriler</h2>
      <p>Kulüp üyeliği: 2</p>
      <p>{`${myFavourites} üye favorilere eklendi`}</p>
    </div>
  );
};

export default PlayerSubscriptions;
