import React, { useEffect } from "react";

import { AiFillStar } from "react-icons/ai";

import { Link } from "react-router-dom";

import paths from "../../../../routing/Paths";

import styles from "./styles.module.scss";

import PageLoading from "../../../../components/loading/PageLoading";

import { useAppSelector } from "../../../../store/hooks";
import { useGetUsersQuery } from "../../../../store/auth/apiSlice";
import { useGetPlayersQuery } from "../../../../api/endpoints/PlayersApi";
import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import {
  useGetFavouritesQuery,
  useUpdateFavouriteMutation,
} from "../../../../api/endpoints/FavouritesApi";

const PlayerFavouriteResults = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery({});
  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});
  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );
  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});
  const {
    data: favourites,
    isLoading: isFavouritesLoading,
    refetch: refetchFavourites,
  } = useGetFavouritesQuery({});

  const myFavourites = favourites?.filter(
    (favourite) =>
      favourite.favouriter_id === user?.user?.user_id &&
      favourite.is_active === true
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

  const userFavouriteeQuantity = (favoritee_id: number) => {
    return favourites.filter(
      (favourite) =>
        favourite.favouritee_id === favoritee_id && favourite.is_active === true
    ).length;
  };
  useEffect(() => {
    if (isUpdateFavouriteSuccess) {
      refetchFavourites();
    }
  }, [isUpdateFavouriteSuccess]);

  if (
    isUsersLoading ||
    isPlayersLoading ||
    isTrainersLoading ||
    isClubsLoading ||
    isFavouritesLoading
  ) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      {myFavourites?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th></th>
              <th>İsim</th>
              <th>Tür</th>
              <th>Favorilenme Sayısı</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {myFavourites?.map((favourite) => (
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
                  <Link
                    to={`${paths.EXPLORE_PROFILE}${
                      users?.find(
                        (user) => user.user_id === favourite.favouritee_id
                      )?.user_type_id
                    }/${favourite.favouritee_id}`}
                    className={styles["favourite-name"]}
                  >
                    {users?.find(
                      (user) => user.user_id === favourite.favouritee_id
                    )?.user_type_id === 1
                      ? `${
                          players?.find(
                            (player) =>
                              player.user_id === favourite.favouritee_id
                          )?.fname
                        } ${
                          players?.find(
                            (player) =>
                              player.user_id === favourite.favouritee_id
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
                  </Link>
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
                <td>{userFavouriteeQuantity(favourite.favouritee_id)}</td>
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
      ) : (
        myFavourites?.length === 0 && (
          <p>Favorilere eklenen oyuncu, eğitmen veya kulüp bulunmamaktadır</p>
        )
      )}
    </div>
  );
};

export default PlayerFavouriteResults;
