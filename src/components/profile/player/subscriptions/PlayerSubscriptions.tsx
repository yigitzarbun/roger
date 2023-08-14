import React from "react";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";
import { useGetFavouritesQuery } from "../../../../api/endpoints/FavouritesApi";
import { useGetClubSubscriptionsQuery } from "../../../../api/endpoints/ClubSubscriptionsApi";
import { useGetClubSubscriptionTypesQuery } from "../../../../api/endpoints/ClubSubscriptionTypesApi";
import { useGetClubSubscriptionPackagesQuery } from "../../../../api/endpoints/ClubSubscriptionPackagesApi";

const PlayerSubscriptions = () => {
  const user = useAppSelector((store) => store.user?.user?.user);

  const { data: favourites, isLoading: isFavouritesLoading } =
    useGetFavouritesQuery({});

  const myFavourites = favourites?.filter(
    (favourite) => favourite.favouriter_id === user?.user_id
  );

  const { data: clubSubscriptions, isLoading: isClubSubscriptionsLoading } =
    useGetClubSubscriptionsQuery({});

  const { data: subscriptionTypes, isLoading: isSubscriptionTypesLoading } =
    useGetClubSubscriptionTypesQuery({});

  const {
    data: subscriptionPackages,
    isLoading: isSubscriptionPackagesLoading,
  } = useGetClubSubscriptionPackagesQuery({});

  const mySubscriptions = clubSubscriptions?.filter(
    (subscription) => subscription.player_id === user?.user_id
  );

  if (
    isFavouritesLoading ||
    isClubSubscriptionsLoading ||
    isSubscriptionTypesLoading ||
    isSubscriptionPackagesLoading
  ) {
    return <div>Yükleniyor..</div>;
  }
  return (
    <div className={styles["player-stats-container"]}>
      <h2>Üyelikler ve Favoriler</h2>
      <p>{`${mySubscriptions.length} kulüp üyeliği bulunmaktadır`}</p>
      <p>{`${myFavourites.length} üye favorilere eklendi`}</p>
    </div>
  );
};

export default PlayerSubscriptions;
