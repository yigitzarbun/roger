import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";

import { AiFillStar } from "react-icons/ai";

import { Link } from "react-router-dom";

import paths from "../../../../routing/Paths";

import styles from "./styles.module.scss";

import PageLoading from "../../../../components/loading/PageLoading";

import { useAppSelector } from "../../../../store/hooks";

import {
  useGetFavouritesQuery,
  useUpdateFavouriteMutation,
} from "../../../../api/endpoints/FavouritesApi";
import { useGetClubSubscriptionsQuery } from "../../../../api/endpoints/ClubSubscriptionsApi";
import { useGetStudentGroupsQuery } from "../../../../api/endpoints/StudentGroupsApi";
import { useGetClubSubscriptionPackagesQuery } from "../../../../api/endpoints/ClubSubscriptionPackagesApi";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetClubSubscriptionTypesQuery } from "../../../../api/endpoints/ClubSubscriptionTypesApi";
import { useGetUsersQuery } from "../../../../store/auth/apiSlice";
import { useGetPlayersQuery } from "../../../../api/endpoints/PlayersApi";
import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";

const PlayerSubscriptions = () => {
  const user = useAppSelector((store) => store.user?.user?.user);

  const {
    data: favourites,
    isLoading: isFavouritesLoading,
    refetch: refetchFavourites,
  } = useGetFavouritesQuery({});

  const { data: clubSubscriptions, isLoading: isClubSubscriptionsLoading } =
    useGetClubSubscriptionsQuery({});

  const {
    data: clubSubscriptionPackages,
    isLoading: isClubSubscriptionPackagesLoading,
  } = useGetClubSubscriptionPackagesQuery({});

  const {
    data: clubSubscriptionTypes,
    isLoading: isClubSubscriptionTypesLoading,
  } = useGetClubSubscriptionTypesQuery({});

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery({});

  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );

  const { data: studentGroups, isLoading: isStudentGroupsLoading } =
    useGetStudentGroupsQuery({});

  const myFavourites = favourites?.filter(
    (favourite) =>
      favourite.favouriter_id === user?.user_id && favourite.is_active === true
  );

  const mySubscriptions = clubSubscriptions?.filter(
    (subscription) => subscription.player_id === user?.user_id
  );

  const [updateFavourite, { isSuccess: isUpdateFavouriteSuccess }] =
    useUpdateFavouriteMutation({});

  const handleUpdateFavourite = (favouritee_id: number) => {
    const selectedFavouritee = myFavourites?.find(
      (favourite) => favourite.favouritee_id === favouritee_id
    );
    const updatedFavouriteeData = {
      ...selectedFavouritee,
      is_active: false,
    };
    updateFavourite(updatedFavouriteeData);
  };

  const myGroups = studentGroups?.filter(
    (group) =>
      group.is_active === true &&
      (group.first_student_id === user?.user_id ||
        group.second_student_id === user?.user_id ||
        group.third_student_id === user?.user_id ||
        group.fourth_student_id === user?.user_id)
  );

  const [display, setDisplay] = useState("subscriptions");

  const handleDisplay = (value: string) => {
    setDisplay(value);
  };

  useEffect(() => {
    if (isUpdateFavouriteSuccess) {
      refetchFavourites();
      toast.success("İşlem başarılı");
    }
  }, [isUpdateFavouriteSuccess]);

  if (
    isFavouritesLoading ||
    isClubSubscriptionsLoading ||
    isStudentGroupsLoading ||
    isClubSubscriptionPackagesLoading ||
    isClubsLoading ||
    isClubSubscriptionTypesLoading ||
    isUsersLoading ||
    isPlayersLoading
  ) {
    return <PageLoading />;
  }
  return (
    <div className={styles["player-subscriptions-container"]}>
      <h2>Üyelikler ve Favoriler</h2>
      <div className={styles["nav-container"]}>
        <button
          onClick={() => handleDisplay("subscriptions")}
          className={
            display === "subscriptions"
              ? styles["active-button"]
              : styles["inactive-button"]
          }
        >
          Üyelikler
        </button>
        <button
          onClick={() => handleDisplay("favourites")}
          className={
            display === "favourites"
              ? styles["active-button"]
              : styles["inactive-button"]
          }
        >
          Favoriler
        </button>
        <button
          onClick={() => handleDisplay("groups")}
          className={
            display === "groups"
              ? styles["active-button"]
              : styles["inactive-button"]
          }
        >
          Gruplar
        </button>
      </div>

      {display === "subscriptions" &&
        (mySubscriptions?.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Kulüp</th>
                <th>Tür</th>
                <th>Başlangıç</th>
                <th>Bitiş</th>
              </tr>
            </thead>
            <tbody>
              {mySubscriptions
                ?.slice(mySubscriptions.length - 1)
                ?.map((subscription) => (
                  <tr key={subscription.club_subscription_id}>
                    <td>
                      <Link
                        to={`${paths.EXPLORE_PROFILE}3/${subscription.club_id}`}
                      >
                        <img
                          src={
                            clubs?.find(
                              (club) => club.user_id === subscription.club_id
                            )?.image
                              ? clubs?.find(
                                  (club) =>
                                    club.user_id === subscription.club_id
                                )?.image
                              : "/images/icons/avatar.png"
                          }
                          className={styles.image}
                        />
                      </Link>
                    </td>
                    <td>
                      {
                        clubs?.find(
                          (club) => club.user_id === subscription.club_id
                        )?.club_name
                      }
                    </td>
                    <td>
                      {clubSubscriptionTypes
                        ?.find(
                          (type) =>
                            type.club_subscription_type_id ===
                            clubSubscriptionPackages?.find(
                              (subscriptionPackage) =>
                                subscriptionPackage.club_subscription_package_id ===
                                subscription.club_subscription_package_id
                            )?.club_subscription_type_id
                        )
                        ?.club_subscription_type_name?.split(" ")
                        .slice(0, 2)
                        .join(" ")}
                    </td>
                    <td>{subscription.start_date.slice(0, 10)}</td>
                    <td>{subscription.end_date.slice(0, 10)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : display === "subscriptions" && mySubscriptions?.length === 0 ? (
          <h4>Kulüp üyeliği bulunmamaktadır</h4>
        ) : (
          ""
        ))}

      {display === "favourites" && myFavourites?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th></th>
              <th>İsim</th>
              <th>Tür</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {myFavourites?.slice(myFavourites.length - 1)?.map((favourite) => (
              <tr key={favourite.favourite_id}>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}${
                      users?.find(
                        (user) => user.user_id === favourite.favouritee_id
                      )?.user_type_id
                    }/${favourite.favouritee_id}`}
                  >
                    <img
                      src={
                        users?.find(
                          (user) => user.user_id === favourite.favouritee_id
                        )?.user_type_id === 1 &&
                        players?.find(
                          (player) => player.user_id === favourite.favouritee_id
                        )?.image
                          ? players?.find(
                              (player) =>
                                player.user_id === favourite.favouritee_id
                            )?.image
                          : users?.find(
                              (user) => user.user_id === favourite.favouritee_id
                            )?.user_type_id === 2 &&
                            trainers?.find(
                              (trainer) =>
                                trainer.user_id === favourite.favouritee_id
                            )?.image
                          ? trainers?.find(
                              (trainer) =>
                                trainer.user_id === favourite.favouritee_id
                            )?.image
                          : users?.find(
                              (user) => user.user_id === favourite.favouritee_id
                            )?.user_type_id === 3 &&
                            clubs?.find(
                              (club) => club.user_id === favourite.favouritee_id
                            )?.image
                          ? clubs?.find(
                              (club) => club.user_id === favourite.favouritee_id
                            )?.image
                          : "/images/icons/avatar.png"
                      }
                      className={styles.image}
                    />
                  </Link>
                </td>
                <td>
                  {users?.find(
                    (user) => user.user_id === favourite.favouritee_id
                  )?.user_type_id === 1
                    ? `${
                        players?.find(
                          (player) => player.user_id === favourite.favouritee_id
                        )?.fname
                      } ${
                        players?.find(
                          (player) => player.user_id === favourite.favouritee_id
                        )?.lname
                      }`
                    : users?.find(
                        (user) => user.user_id === favourite.favouritee_id
                      )?.user_type_id === 2
                    ? `${
                        trainers?.find(
                          (trainer) =>
                            trainer.user_id === favourite.favouritee_id
                        )?.fname
                      } ${
                        trainers?.find(
                          (trainer) =>
                            trainer.user_id === favourite.favouritee_id
                        )?.lname
                      }`
                    : users?.find(
                        (user) => user.user_id === favourite.favouritee_id
                      )?.user_type_id === 3
                    ? clubs?.find(
                        (club) => club.user_id === favourite.favouritee_id
                      )?.club_name
                    : ""}
                </td>
                <td>
                  {users?.find(
                    (user) => user.user_id === favourite.favouritee_id
                  )?.user_type_id === 1
                    ? "Oyuncu"
                    : users?.find(
                        (user) => user.user_id === favourite.favouritee_id
                      )?.user_type_id === 2
                    ? "Eğitmen"
                    : users?.find(
                        (user) => user.user_id === favourite.favouritee_id
                      )?.user_type_id === 3
                    ? "Kulüp"
                    : "Diğer"}
                </td>
                <td>
                  <AiFillStar
                    onClick={() =>
                      handleUpdateFavourite(favourite.favouritee_id)
                    }
                    className={styles["remove-fav-icon"]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : display === "favourites" && myFavourites?.length === 0 ? (
        <h4>Favorilere eklenen oyuncu, eğitmen veya kulüp bulunmamaktadır</h4>
      ) : (
        ""
      )}

      {display === "groups" && myGroups?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Kulüp</th>
              <th>Grup</th>
              <th>Oyuncular</th>
              <th>Eğitmen</th>
            </tr>
          </thead>
          <tbody>
            {myGroups?.map((group) => (
              <tr key={group.student_group_id}>
                <td>
                  <Link to={`${paths.EXPLORE_PROFILE}3/${group.club_id}`}>
                    <img
                      src={
                        clubs?.find((club) => club.user_id === group.club_id)
                          ?.image
                          ? clubs?.find(
                              (club) => club.user_id === group.club_id
                            )?.image
                          : "/images/icons/avatar.png"
                      }
                      className={styles.image}
                    />
                  </Link>
                </td>
                <td>
                  {
                    clubs?.find((club) => club.user_id === group.club_id)
                      ?.club_name
                  }
                </td>
                <td>{group.student_group_name}</td>
                <td>
                  {group.fourth_student_id
                    ? 4
                    : group.third_student_id
                    ? 3
                    : group.second_student_id
                    ? 2
                    : 1}
                </td>
                <td>{`${
                  trainers?.find(
                    (trainer) => trainer.user_id === group.trainer_id
                  )?.fname
                } ${
                  trainers?.find(
                    (trainer) => trainer.user_id === group.trainer_id
                  )?.lname
                }`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : display === "groups" && myGroups?.length === 0 ? (
        <h4>Kulüp oyuncu grubu üyeliği bulunmamaktadır</h4>
      ) : (
        ""
      )}

      <Link to={paths.SOCIAL} className={styles["view-all-button"]}>
        Tümünü Görüntüle
      </Link>
    </div>
  );
};

export default PlayerSubscriptions;
