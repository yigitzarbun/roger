import React from "react";
import { Link } from "react-router-dom";

import paths from "../../../routing/Paths";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../store/hooks";

import { useGetPlayersQuery } from "../../../api/endpoints/PlayersApi";
import { useGetLocationsQuery } from "../../../api/endpoints/LocationsApi";
import { useGetPlayerLevelsQuery } from "../../../api/endpoints/PlayerLevelsApi";
import { useGetFavouritesQuery } from "../../../api/endpoints/FavouritesApi";

interface TrainResultsProps {
  playerLevelId: number;
  gender: string;
  locationId: number;
  favourite: boolean;
}

const TrainResults = (props: TrainResultsProps) => {
  const { playerLevelId, gender, locationId, favourite } = props;

  const { user } = useAppSelector((store) => store.user);
  const {
    data: players,
    isLoading: isPlayersLoading,
    isError,
  } = useGetPlayersQuery({});

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const { data: playerLevels, isLoading: isPlayerLevelsLoading } =
    useGetPlayerLevelsQuery({});

  const { data: favourites, isLoading: isFavouritesLoading } =
    useGetFavouritesQuery({});

  const myFavourites = favourites?.filter(
    (favourite) =>
      favourite.favouriter_id === user?.user?.user_id &&
      favourite.is_active === true
  );

  const levelId = Number(playerLevelId) ?? null;
  const selectedGender = gender ?? "";
  const locationIdValue = Number(locationId) ?? null;

  const today = new Date();
  const year = today.getFullYear();

  const filteredPlayers =
    players &&
    players
      .filter((player) => player.user_id !== user.user.user_id)
      .filter((player) => {
        if (
          levelId === 0 &&
          gender === "" &&
          locationIdValue === 0 &&
          favourite !== true
        ) {
          return player;
        } else if (
          (levelId === player.player_level_id || levelId === 0) &&
          (selectedGender === player.gender || selectedGender === "") &&
          (locationIdValue === player.location_id || locationIdValue === 0) &&
          ((favourite === true &&
            myFavourites.find(
              (favourite) => favourite.favouritee_id === player.user_id
            )) ||
            favourite !== true)
        ) {
          return player;
        }
      });

  if (
    isPlayersLoading ||
    isLocationsLoading ||
    isPlayerLevelsLoading ||
    isFavouritesLoading
  ) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <h2 className={styles["result-title"]}>Antreman</h2>
      </div>
      {isPlayersLoading && <p>Yükleniyor...</p>}
      {isError && <p>Bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>}
      {players && filteredPlayers.length === 0 && (
        <p>
          Aradığınız kritere göre oyuncu bulunamadı. Lütfen filtreyi temizleyip
          tekrar deneyin.
        </p>
      )}
      {players && filteredPlayers.length > 0 && (
        <table>
          <thead>
            <tr>
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
              <tr key={player.player_id}>
                <td className={styles["vertical-center"]}>
                  <img
                    src={
                      player.image ? player.image : "/images/icons/avatar.png"
                    }
                    alt={player.name}
                    className={styles["player-image"]}
                  />
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
                <td>
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
                    Davet gönder
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TrainResults;
