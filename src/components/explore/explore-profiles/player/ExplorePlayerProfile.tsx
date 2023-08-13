import React, { useEffect } from "react";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../../routing/Paths";

import { useGetLocationsQuery } from "../../../../api/endpoints/LocationsApi";
import { useGetPlayersQuery } from "../../../../api/endpoints/PlayersApi";
import { useGetPlayerLevelsQuery } from "../../../../api/endpoints/PlayerLevelsApi";
import {
  useAddFavouriteMutation,
  useGetFavouritesQuery,
  useUpdateFavouriteMutation,
} from "../../../../api/endpoints/FavouritesApi";

import { useAppSelector } from "../../../../store/hooks";

interface ExplorePlayerProfileProps {
  user_id: string;
}
const ExplorePlayerProfile = (props: ExplorePlayerProfileProps) => {
  const { user_id } = props;

  const user = useAppSelector((store) => store.user?.user);

  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const { data: playerLevels, isLoading: isPlayerLevelsLoading } =
    useGetPlayerLevelsQuery({});

  const selectedPlayer = players?.find(
    (player) => player.user_id === Number(user_id)
  );

  const {
    data: favourites,
    isLoading: isFavouritesLoading,
    refetch,
  } = useGetFavouritesQuery({});

  const playerFavouriters = favourites?.filter(
    (favourite) =>
      favourite.favouritee_id === Number(user_id) && favourite.isActive === true
  )?.length;

  const myFavouritePlayers = favourites?.filter(
    (favourite) => favourite.favouriter_id === user?.user?.user_id
  );

  const isPlayerInMyFavourites = (user_id: number) => {
    if (
      myFavouritePlayers.find(
        (favourite) =>
          favourite.favouritee_id === user_id && favourite.isActive === false
      )
    ) {
      return "deactivated";
    } else if (
      myFavouritePlayers.find(
        (favourite) =>
          favourite.favouritee_id === user_id && favourite.isActive === true
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
      isActive: true,
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
      isActive: selectedFavourite.isActive === true ? false : true,
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
    }
  }, [isAddFavouriteSuccess, isUpdateFavouriteSuccess]);

  if (
    isLocationsLoading ||
    isLocationsLoading ||
    isPlayersLoading ||
    isPlayerLevelsLoading ||
    isFavouritesLoading
  ) {
    return <div>Yükleniyor..</div>;
  }

  return (
    <div className={styles.profile}>
      <div className={styles["top-sections-container"]}>
        <div className={styles["profile-section"]}>
          <h3>Oyuncu</h3>
          <img
            src={
              selectedPlayer?.picture
                ? selectedPlayer?.picture
                : "/images/icons/avatar.png"
            }
            alt="club_picture"
            className={styles["club-image"]}
          />
          <h2>{`${selectedPlayer?.fname} ${selectedPlayer.lname}`}</h2>
          <p>{selectedPlayer?.player_bio_description}</p>
          <p>{selectedPlayer?.gender}</p>
          <p>{selectedPlayer?.birth_year}</p>
          <p>
            {
              playerLevels?.find(
                (level) =>
                  level.player_level_id === selectedPlayer?.player_level_id
              )?.player_level_name
            }
          </p>
          <p>
            {
              locations?.find(
                (location) =>
                  location.location_id === selectedPlayer?.location_id
              )?.location_name
            }
          </p>
        </div>
        <div className={styles["subscription-section"]}>
          <h3>Etkileşim</h3>
          <p>{`${playerFavouriters} kişi favorilere ekledi`}</p>
          <button
            onClick={() => handleToggleFavourite(selectedPlayer?.user_id)}
          >
            {isPlayerInMyFavourites(selectedPlayer?.user_id) === true
              ? "Favorilerden çıkar"
              : "Favorilere ekle"}
          </button>
          <Link
            to={paths.TRAIN_INVITE}
            state={{
              fname: selectedPlayer.fname,
              lname: selectedPlayer.lname,
              image: selectedPlayer.image,
              court_price: "",
              user_id: selectedPlayer.user_id,
            }}
            className={styles["accept-button"]}
          >
            <button> Antreman yap</button>
          </Link>
          <Link
            to={paths.MATCH_INVITE}
            state={{
              fname: selectedPlayer.fname,
              lname: selectedPlayer.lname,
              image: selectedPlayer.image,
              court_price: "",
              user_id: selectedPlayer.user_id,
            }}
            className={styles["accept-button"]}
          >
            <button> Maç yap</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default ExplorePlayerProfile;
