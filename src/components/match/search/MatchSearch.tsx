import React, { ChangeEvent } from "react";

import styles from "./styles.module.scss";

import { useGetLocationsQuery } from "../../../api/endpoints/LocationsApi";
import { useGetPlayerLevelsQuery } from "../../../api/endpoints/PlayerLevelsApi";
import PageLoading from "../../../components/loading/PageLoading";

interface MatchSearchProps {
  handleLevel: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleLocation: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleFavourite: (event: ChangeEvent<HTMLInputElement>) => void;
  handleClear: () => void;
  playerLevelId: number;
  locationId: number;
  favourite: boolean;
}

const MatchSearch = (props: MatchSearchProps) => {
  const {
    handleLevel,
    handleLocation,
    handleFavourite,
    handleClear,
    playerLevelId,
    locationId,
    favourite,
  } = props;

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const { data: playerLevels, isLoading: isPlayerLevelsLoading } =
    useGetPlayerLevelsQuery({});

  if (isLocationsLoading || isPlayerLevelsLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["match-page-container"]}>
      <div className={styles["input-container"]}>
        <select onChange={handleLevel} value={playerLevelId ?? ""}>
          <option value="">-- Seviye --</option>
          {playerLevels?.map((player_level) => (
            <option
              key={player_level.player_level_id}
              value={player_level.player_level_id}
            >
              {player_level.player_level_name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles["input-container"]}>
        <select onChange={handleLocation} value={locationId ?? ""}>
          <option value="">-- Konum --</option>
          {locations?.map((location) => (
            <option key={location.location_id} value={location.location_id}>
              {location.location_name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles["input-container"]}>
        <label>Favori</label>
        <input
          type="checkbox"
          checked={favourite || false}
          onChange={handleFavourite}
          className="input-element"
        />
      </div>
      <button onClick={handleClear} className={styles["button"]}>
        Temizle
      </button>
    </div>
  );
};

export default MatchSearch;
