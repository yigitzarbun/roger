import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { SlOptions } from "react-icons/sl";

import { AiFillStar } from "react-icons/ai";

import { Link } from "react-router-dom";

import paths from "../../routing/Paths";

import styles from "./styles.module.scss";

import PageLoading from "../loading/PageLoading";

import { useAppSelector } from "../../store/hooks";

import {
  Favourite,
  useGetPlayerActiveFavouritesByUserIdQuery,
  useUpdateFavouriteMutation,
} from "../../api/endpoints/FavouritesApi";

const FavouritesResults = () => {
  const user = useAppSelector((store) => store?.user?.user);
  const [currentPage, setCurrentPage] = useState(1);

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

  const handlePlayerPage = (e) => {
    setCurrentPage(e.target.value);
  };

  const handleNextPage = () => {
    const nextPage = (currentPage % myFavourites?.totalPages) + 1;
    setCurrentPage(nextPage);
  };

  const handlePrevPage = () => {
    const prevPage =
      ((currentPage - 2 + myFavourites?.totalPages) %
        myFavourites?.totalPages) +
      1;
    setCurrentPage(prevPage);
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
      <div className={styles["title-container"]}>
        <h2 className={styles.title}>Favoriler</h2>
        {myFavourites?.length > 0 && (
          <div className={styles["nav-container"]}>
            <FaAngleLeft
              onClick={handlePrevPage}
              className={styles["nav-arrow"]}
            />

            <FaAngleRight
              onClick={handleNextPage}
              className={styles["nav-arrow"]}
            />
          </div>
        )}
      </div>
      {myFavourites?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th></th>
              <th>İsim</th>
              <th>Seviye</th>
              <th>Konum</th>
              <th>Tür</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {myFavourites?.map((favourite) => (
              <tr key={favourite.favourite_id} className={styles.row}>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}${favourite?.user_type_id}/${favourite.favouritee_id}`}
                  >
                    <img
                      src={
                        favourite?.image
                          ? favourite?.image
                          : "/images/icons/avatar.jpg"
                      }
                      className={styles.image}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}${favourite?.user_type_id}/${favourite.favouritee_id}`}
                    className={styles.name}
                  >
                    {favourite?.fname || favourite?.lname
                      ? `${favourite?.fname} ${favourite?.lname}`
                      : favourite.club_name}
                  </Link>
                </td>
                <td>
                  {favourite?.player_level_name
                    ? favourite?.player_level_name
                    : favourite?.trainer_experience_type_name
                    ? favourite?.trainer_experience_type_name
                    : "-"}
                </td>
                <td>{favourite?.location_name}</td>
                <td>{favourite?.user_type_name}</td>
                <td>
                  <button
                    onClick={() =>
                      handleUpdateFavourite(favourite?.favouritee_id)
                    }
                    className={styles["favourite-button"]}
                  >
                    Favoriden çıkar
                  </button>
                </td>
                <td>
                  <SlOptions className={styles.icon} />
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

export default FavouritesResults;
