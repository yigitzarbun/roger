import React, { useEffect } from "react";

import { Link } from "react-router-dom";

import paths from "../../../../../../routing/Paths";
import { localUrl } from "../../../../../../common/constants/apiConstants";

import styles from "./styles.module.scss";

import PageLoading from "../../../../../../components/loading/PageLoading";

import {
  Player,
  useGetPlayerByUserIdQuery,
} from "../../../../../../api/endpoints/PlayersApi";
import {
  useAddFavouriteMutation,
  useGetFavouritesByFilterQuery,
  useUpdateFavouriteMutation,
} from "../../../../../../api/endpoints/FavouritesApi";
import { useAppSelector } from "../../../../../../store/hooks";
import { Club } from "../../../../../../api/endpoints/ClubsApi";
import { getAge } from "../../../../../../common/util/TimeFunctions";

interface ExplorePlayersInteractionsSectionsProps {
  selectedPlayer: Player;
  user_id: number;
  clubs: Club[];
}

const ExplorePlayersInteractionsSections = (
  props: ExplorePlayersInteractionsSectionsProps
) => {
  const { selectedPlayer, user_id, clubs } = props;

  const user = useAppSelector((store) => store?.user?.user);

  const isUserPlayer = user?.user?.user_type_id === 1;
  const isUserTrainer = user?.user?.user_type_id === 2;
  const profileImage = selectedPlayer?.[0]?.image;
  const { data: currentPlayer, isLoading: isCurrentPlayerLoading } =
    useGetPlayerByUserIdQuery(user?.user?.user_id);
  console.log(selectedPlayer);
  const userGender = currentPlayer?.[0]?.gender;

  const {
    data: playerFavouriters,
    isLoading: isPlayerFavouritersLoading,
    refetch,
  } = useGetFavouritesByFilterQuery({
    is_active: true,
    favouritee_id: user_id,
  });

  const {
    data: myFavouritePlayers,
    isLoading: isMyFavouritePlayersLoading,
    refetch: refetchMyFavourites,
  } = useGetFavouritesByFilterQuery({
    favouriter_id: user?.user?.user_id,
  });

  const isPlayerInMyFavourites = (user_id: number) => {
    return myFavouritePlayers?.find(
      (player) => player.favouritee_id === user_id
    );
  };

  const [addFavourite, { isSuccess: isAddFavouriteSuccess }] =
    useAddFavouriteMutation();

  const [updateFavourite, { isSuccess: isUpdateFavouriteSuccess }] =
    useUpdateFavouriteMutation();

  const handleAddFavourite = (favouritee_id: number) => {
    const favouriteData = {
      is_active: true,
      favouriter_id: user?.user?.user_id,
      favouritee_id: favouritee_id,
    };
    addFavourite(favouriteData);
  };

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

  useEffect(() => {
    if (isAddFavouriteSuccess || isUpdateFavouriteSuccess) {
      refetch();
      refetchMyFavourites();
    }
  }, [isAddFavouriteSuccess, isUpdateFavouriteSuccess]);

  if (isPlayerFavouritersLoading || isMyFavouritePlayersLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["interaction-section"]}>
      <img
        src={
          profileImage
            ? `${localUrl}/${profileImage}`
            : "/images/icons/avatar.png"
        }
        alt="player picture"
        className={styles["profile-image"]}
      />

      <div className={styles["bio-container"]}>
        <div className={styles["top-container"]}>
          <div className={styles["name-container"]}>
            <h2>{`${selectedPlayer?.[0]?.fname} ${selectedPlayer?.[0]?.lname}`}</h2>
            <h4>Oyuncu</h4>
          </div>
          <div className={styles["table-container"]}>
            <table>
              <thead>
                <tr>
                  <th>Yaş</th>
                  <th>Cinsiyet</th>
                  <th>Konum</th>
                  <th>Seviye</th>
                  <th>Maç</th>
                  <th>W</th>
                  <th>L</th>
                  <th>Puan</th>
                </tr>
              </thead>
              <tbody>
                <tr className={styles["player-row"]}>
                  <td>{getAge(Number(selectedPlayer?.[0]?.birth_year))}</td>
                  <td>{selectedPlayer?.[0]?.gender}</td>
                  <td>{selectedPlayer?.[0]?.location_name}</td>
                  <td>{selectedPlayer?.[0]?.player_level_name}</td>
                  <td>{selectedPlayer?.[0]?.totalmatches}</td>
                  <td className={styles["win-count"]}>
                    {selectedPlayer?.[0]?.wonmatches}
                  </td>
                  <td className={styles["lost-count"]}>
                    {selectedPlayer?.[0]?.lostmatches}
                  </td>
                  <td className={styles["points-count"]}>
                    {selectedPlayer?.[0]?.playerpoints}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className={styles["buttons-container"]}>
              <button
                onClick={() =>
                  handleToggleFavourite(selectedPlayer?.[0]?.user_id)
                }
                className={styles["interaction-button"]}
              >
                {isPlayerInMyFavourites(selectedPlayer?.[0]?.user_id)
                  ?.is_active === true
                  ? "Favorilerden çıkar"
                  : "Favorilere ekle"}
              </button>
              {isUserPlayer && (
                <Link
                  to={paths.TRAIN_INVITE}
                  state={{
                    fname: selectedPlayer?.[0]?.fname,
                    lname: selectedPlayer?.[0]?.lname,
                    image: selectedPlayer?.[0]?.image,
                    court_price: "",
                    user_id: selectedPlayer?.[0]?.user_id,
                  }}
                >
                  <button className={styles["interaction-button"]}>
                    Antreman yap
                  </button>
                </Link>
              )}
              {isUserPlayer && selectedPlayer?.[0]?.gender === userGender && (
                <Link
                  to={paths.MATCH_INVITE}
                  state={{
                    fname: selectedPlayer?.[0]?.fname,
                    lname: selectedPlayer?.[0]?.lname,
                    image: selectedPlayer?.[0]?.image,
                    court_price: "",
                    user_id: selectedPlayer?.[0]?.user_id,
                  }}
                >
                  <button className={styles["interaction-button"]}>
                    Maç yap
                  </button>
                </Link>
              )}
              {isUserTrainer && (
                <Link
                  to={paths.LESSON_INVITE}
                  state={{
                    fname: selectedPlayer?.[0]?.fname,
                    lname: selectedPlayer?.[0]?.lname,
                    image: selectedPlayer?.[0]?.image,
                    court_price: "",
                    user_id: selectedPlayer?.[0]?.user_id,
                  }}
                >
                  <button className={styles["interaction-button"]}>
                    Derse davet et
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePlayersInteractionsSections;
