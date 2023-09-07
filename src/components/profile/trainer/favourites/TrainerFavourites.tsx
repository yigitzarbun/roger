import React, { useEffect } from "react";

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
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";
import { useGetPlayersQuery } from "../../../../api/endpoints/PlayersApi";
import { useGetUsersQuery } from "../../../../store/auth/apiSlice";
import { useGetUserTypesQuery } from "../../../../api/endpoints/UserTypesApi";

const TrainerFavourites = () => {
  const user = useAppSelector((store) => store?.user?.user);
  const {
    data: favourites,
    isLoading: isFavouritesLoading,
    refetch: refetchFavourites,
  } = useGetFavouritesQuery({});
  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});
  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );
  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});
  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery({});
  const { data: userTypes, isLoading: isUserTypesLoading } =
    useGetUserTypesQuery({});
  const [updateFavourite, { isSuccess: isUpdateFavouriteSuccess }] =
    useUpdateFavouriteMutation({});

  const myFavourites = favourites?.filter(
    (favourite) =>
      favourite.is_active === true &&
      favourite.favouriter_id === user?.user?.user_id
  );

  const handleRemovaFavourite = (favourite_id: number) => {
    const selectedFavourite = myFavourites?.find(
      (favourite) => favourite.favourite_id === favourite_id
    );
    const updatedFavouriteData = {
      ...selectedFavourite,
      is_active: false,
    };
    updateFavourite(updatedFavouriteData);
  };

  useEffect(() => {
    if (isUpdateFavouriteSuccess) {
      refetchFavourites();
    }
  }, [isUpdateFavouriteSuccess]);

  if (
    isFavouritesLoading ||
    isClubsLoading ||
    isTrainersLoading ||
    isPlayersLoading ||
    isUsersLoading ||
    isUserTypesLoading
  ) {
    return <PageLoading />;
  }
  return (
    <div className={styles["trainer-favourites-container"]}>
      <h2>Favoriler</h2>
      {myFavourites?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Favori</th>
              <th>İsim</th>
              <th>Tür</th>
            </tr>
          </thead>
          <tbody>
            {myFavourites?.slice(myFavourites?.length - 1)?.map((favourite) => (
              <tr key={favourite.favourite_id}>
                <td>
                  <AiFillStar
                    className={styles["remove-fav-icon"]}
                    onClick={() =>
                      handleRemovaFavourite(favourite.favourite_id)
                    }
                  />
                </td>
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
                      className={styles["favourite-image"]}
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
                  {
                    userTypes?.find(
                      (type) =>
                        type.user_type_id ===
                        users?.find(
                          (user) => user.user_id === favourite.favouritee_id
                        )?.user_type_id
                    )?.user_type_name
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Favorilere eklenmiş oyuncu, eğitmen veya kulüp bulunmamaktadır</p>
      )}

      <Link to={paths.SOCIAL}>
        <button className={styles["view-all-button"]}>Tümünü Görüntüle</button>
      </Link>
    </div>
  );
};
export default TrainerFavourites;
