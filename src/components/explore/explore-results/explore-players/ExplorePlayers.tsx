import React, { useEffect } from "react";

import { AiOutlineEye, AiFillStar, AiOutlineStar } from "react-icons/ai";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../../routing/Paths";

import { User } from "../../../../store/slices/authSlice";

import { Player } from "../../../../api/endpoints/PlayersApi";
import { Location } from "../../../../api/endpoints/LocationsApi";
import { PlayerLevel } from "../../../../api/endpoints/PlayerLevelsApi";
import {
  useAddFavouriteMutation,
  useGetFavouritesQuery,
  useUpdateFavouriteMutation,
} from "../../../../api/endpoints/FavouritesApi";
import PageLoading from "../../../../components/loading/PageLoading";

interface ExplorePlayersProps {
  user: User;
  players: Player[];
  locations: Location[];
  playerLevels: PlayerLevel[];
  isPlayersLoading: boolean;
  isLocationsLoading: boolean;
  isPlayerLevelsLoading: boolean;
}
const ExplorePlayers = (props: ExplorePlayersProps) => {
  const {
    user,
    players,
    locations,
    playerLevels,
    isPlayersLoading,
    isLocationsLoading,
    isPlayerLevelsLoading,
  } = props;

  let isUserPlayer = false;
  let isUserTrainer = false;
  let isUserClub = false;

  if (user) {
    isUserPlayer = user?.user?.user_type_id === 1;
    isUserTrainer = user?.user?.user_type_id === 2;
    isUserClub = user?.user?.user_type_id === 3;
  }

  const currentDate = new Date();
  const year = currentDate.getFullYear();

  const filteredPlayers = players?.filter(
    (player) => player.user_id !== user?.user?.user_id
  );
  const {
    data: favourites,
    isLoading: isFavouritesLoading,
    refetch,
  } = useGetFavouritesQuery({});

  const myFavouritePlayers = favourites?.filter(
    (favourite) => favourite.favouriter_id === user?.user?.user_id
  );
  const isPlayerInMyFavourites = (user_id: number) => {
    if (
      myFavouritePlayers?.find(
        (favourite) =>
          favourite.favouritee_id === user_id && favourite.is_active === false
      )
    ) {
      return "deactivated";
    } else if (
      myFavouritePlayers?.find(
        (favourite) =>
          favourite.favouritee_id === user_id && favourite.is_active === true
      )
    ) {
      return true;
    }
    return false;
  };
  const [addFavourite, { isSuccess: isAddFavouriteSuccess }] =
    useAddFavouriteMutation();

  const handleAddFavourite = (favouritee_id: number) => {
    const favouriteData = {
      is_active: true,
      favouriter_id: user?.user?.user_id,
      favouritee_id: favouritee_id,
    };
    addFavourite(favouriteData);
  };

  const [updateFavourite, { isSuccess: isUpdateFavouriteSuccess }] =
    useUpdateFavouriteMutation();
  const handleUpdateFavourite = (userId: number) => {
    const selectedFavourite = myFavouritePlayers?.find(
      (favourite) => favourite.favouritee_id === userId
    );
    const favouriteData = {
      favourite_id: selectedFavourite.favourite_id,
      registered_at: selectedFavourite.registered_at,
      is_active: selectedFavourite.is_active === true ? false : true,
      favouriter_id: selectedFavourite.favouriter_id,
      favouritee_id: selectedFavourite.favouritee_id,
    };
    updateFavourite(favouriteData);
  };

  const handleToggleFavourite = (userId: number) => {
    if (isPlayerInMyFavourites(userId)) {
      handleUpdateFavourite(userId);
    } else {
      handleAddFavourite(userId);
    }
  };

  const userGender = players?.find(
    (player) => player.user_id === user?.user?.user_id
  )?.gender;

  useEffect(() => {
    if (isAddFavouriteSuccess || isUpdateFavouriteSuccess) {
      refetch();
    }
  }, [isAddFavouriteSuccess, isUpdateFavouriteSuccess]);

  if (
    !user ||
    isPlayersLoading ||
    isLocationsLoading ||
    isPlayerLevelsLoading ||
    isFavouritesLoading
  ) {
    return <PageLoading />;
  }
  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <h2 className={styles["result-title"]}>Oyuncuları Keşfet</h2>
      </div>
      {players && filteredPlayers.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th></th>
              <th></th>
              <th>Oyuncu</th>
              <th>İsim</th>
              <th>Seviye</th>
              <th>Cinsiyet</th>
              <th>Yaş</th>
              <th>Konum</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.map((player) => (
              <tr key={player.player_id} className={styles["player-row"]}>
                <td>
                  {isPlayerInMyFavourites(player.user_id) === true ? (
                    <AiFillStar
                      className={styles["remove-fav-icon"]}
                      onClick={() => handleToggleFavourite(player.user_id)}
                    />
                  ) : (
                    <AiOutlineStar
                      className={styles["add-fav-icon"]}
                      onClick={() => handleToggleFavourite(player.user_id)}
                    />
                  )}
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}1/${player.user_id} `}
                    className={styles["view-icon"]}
                  >
                    <AiOutlineEye />
                  </Link>
                </td>
                <td className={styles["vertical-center"]}>
                  <Link to={`${paths.EXPLORE_PROFILE}1/${player.user_id} `}>
                    <img
                      src={
                        player.image ? player.image : "/images/icons/avatar.png"
                      }
                      alt={player.fname}
                      className={styles["player-image"]}
                    />
                  </Link>
                </td>
                <td>{`${player.fname} ${player.lname}`}</td>
                <td>
                  {
                    playerLevels?.find(
                      (player_level) =>
                        player_level.player_level_id === player.player_level_id
                    ).player_level_name
                  }
                </td>
                <td>{player.gender}</td>
                <td>{year - Number(player.birth_year)}</td>
                <td>
                  {
                    locations?.find(
                      (location) => location.location_id === player.location_id
                    ).location_name
                  }
                </td>
                <td className={styles["vertical-center"]}>
                  <div className={styles["action-buttons-container"]}>
                    {isUserPlayer && (
                      <Link
                        to={paths.TRAIN_INVITE}
                        state={{
                          fname: player.fname,
                          lname: player.lname,
                          image: player.image,
                          court_price: "",
                          user_id: player.user_id,
                        }}
                        className={styles["training-button"]}
                      >
                        Antreman yap
                      </Link>
                    )}
                    {isUserPlayer && player.gender === userGender && (
                      <Link
                        to={paths.MATCH_INVITE}
                        state={{
                          fname: player.fname,
                          lname: player.lname,
                          image: player.image,
                          court_price: "",
                          user_id: player.user_id,
                        }}
                        className={styles["match-button"]}
                      >
                        Maç yap
                      </Link>
                    )}
                  </div>
                </td>

                {isUserTrainer && (
                  <td>
                    <Link
                      to={paths.LESSON_INVITE}
                      state={{
                        fname: player.fname,
                        lname: player.lname,
                        image: player.image,
                        court_price: "",
                        user_id: player.user_id,
                      }}
                    >
                      Derse davet et
                    </Link>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>
          Aradığınız kritere göre oyuncu bulunamadı. Lütfen filtreyi temizleyip
          tekrar deneyin.
        </p>
      )}
    </div>
  );
};
export default ExplorePlayers;
