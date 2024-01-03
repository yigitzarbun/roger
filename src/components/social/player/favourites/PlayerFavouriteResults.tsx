import React, { useEffect } from "react";

import { toast } from "react-toastify";

import { AiFillStar } from "react-icons/ai";

import { Link } from "react-router-dom";

import paths from "../../../../routing/Paths";

import styles from "./styles.module.scss";

import PageLoading from "../../../../components/loading/PageLoading";

import { useAppSelector } from "../../../../store/hooks";

import {
  Favourite,
  useGetPlayerActiveFavouritesByUserIdQuery,
  useUpdateFavouriteMutation,
} from "../../../../api/endpoints/FavouritesApi";

const PlayerFavouriteResults = () => {
  const user = useAppSelector((store) => store?.user?.user);
  const {
    data: myFavourites,
    isLoading: isFavouritesLoading,
    refetch: refetchFavourites,
  } = useGetPlayerActiveFavouritesByUserIdQuery(user?.user?.user_id);

  const [updateFavourite, { isSuccess: isUpdateFavouriteSuccess }] =
    useUpdateFavouriteMutation({});

  const handleUpdateFavourite = (favouritee_id: number) => {
    const selectedFavouritee = myFavourites?.find(
      (favourite) => favourite.favouritee_id === favouritee_id
    );
    const updatedFavouriteeData: Favourite = {
      favourite_id: selectedFavouritee?.favourite_id,
      registered_at: selectedFavouritee?.registered_at,
      favouriter_id: selectedFavouritee?.favouriter_id,
      favouritee_id: selectedFavouritee?.favouritee_id,
      is_active: false,
    };
    updateFavourite(updatedFavouriteeData);
  };

  useEffect(() => {
    if (isUpdateFavouriteSuccess) {
      refetchFavourites();
      toast.success("İşlem başarılı");
    }
  }, [isUpdateFavouriteSuccess]);

  if (isFavouritesLoading) {
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
              <th>Konum</th>
              <th>Tür</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {myFavourites?.map((favourite) => (
              <tr key={favourite.favourite_id}>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}${favourite?.user_type_id}/${favourite.favouritee_id}`}
                  >
                    <img
                      src={
                        favourite?.image
                          ? favourite?.image
                          : "/images/icons/avatar.png"
                      }
                      className={styles.image}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}${favourite?.user_type_id}/${favourite.favouritee_id}`}
                    className={styles["favourite-name"]}
                  >
                    {favourite?.fname || favourite?.lname
                      ? `${favourite?.fname} ${favourite?.lname}`
                      : favourite.club_name}
                  </Link>
                </td>
                <td>{favourite?.location_name}</td>
                <td>{favourite?.user_type_name}</td>
                <td>
                  <AiFillStar
                    onClick={() =>
                      handleUpdateFavourite(favourite?.favouritee_id)
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
