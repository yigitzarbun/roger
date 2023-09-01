import React from "react";

import styles from "./styles.module.scss";

import PageLoading from "../../../../components/loading/PageLoading";

import { useAppSelector } from "../../../../store/hooks";

import { useGetFavouritesQuery } from "../../../../api/endpoints/FavouritesApi";
import { useGetClubSubscriptionsQuery } from "../../../../api/endpoints/ClubSubscriptionsApi";
import { useGetStudentGroupsQuery } from "../../../../api/endpoints/StudentGroupsApi";

const PlayerSubscriptions = () => {
  const user = useAppSelector((store) => store.user?.user?.user);

  const { data: favourites, isLoading: isFavouritesLoading } =
    useGetFavouritesQuery({});

  const { data: clubSubscriptions, isLoading: isClubSubscriptionsLoading } =
    useGetClubSubscriptionsQuery({});

  const { data: studentGroups, isLoading: isStudentGroupsLoading } =
    useGetStudentGroupsQuery({});

  const myFavourites = favourites?.filter(
    (favourite) => favourite.favouriter_id === user?.user_id
  );

  const mySubscriptions = clubSubscriptions?.filter(
    (subscription) => subscription.player_id === user?.user_id
  );

  const myGroups = studentGroups?.filter(
    (group) =>
      group.is_active === true &&
      (group.first_student_id === user?.user_id ||
        group.second_student_id === user?.user_id ||
        group.third_student_id === user?.user_id ||
        group.fourth_student_id === user?.user_id)
  );

  if (
    isFavouritesLoading ||
    isClubSubscriptionsLoading ||
    isStudentGroupsLoading
  ) {
    return <PageLoading />;
  }
  return (
    <div className={styles["player-subscriptions-container"]}>
      <h2>Üyelikler ve Favoriler</h2>
      <div className={styles["stats-container"]}>
        <div className={styles.stat}>
          <p className={styles["stat-number"]}>{mySubscriptions?.length}</p>
          <p>Üyelik</p>
        </div>
        <div className={styles.stat}>
          <p className={styles["stat-number"]}>{myGroups?.length}</p>
          <p>Grup</p>
        </div>
        <div className={styles.stat}>
          <p className={styles["stat-number"]}>{myFavourites?.length}</p>
          <p>Favori</p>
        </div>
      </div>
      <button className={styles["view-all-button"]}>Görüntüle</button>
    </div>
  );
};

export default PlayerSubscriptions;
