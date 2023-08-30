import React from "react";

import styles from "./styles.module.scss";

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
    return <div>Yükleniyor..</div>;
  }
  return (
    <div className={styles["player-stats-container"]}>
      <h2>Üyelikler ve Favoriler</h2>
      <p>{`${mySubscriptions.length} kulüp üyeliği bulunmaktadır`}</p>
      <p>{`${myGroups.length} kulüp oyuncu grubunda yer almaktadır`}</p>
      <p>{`${myFavourites.length} üye favorilere eklendi`}</p>
    </div>
  );
};

export default PlayerSubscriptions;
