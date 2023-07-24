import React, { ChangeEvent } from "react";

import styles from "./styles.module.scss";

import { useGetLocationsQuery } from "../../../api/endpoints/LocationsApi";
import { useGetPlayerLevelsQuery } from "../../../api/endpoints/PlayerLevelsApi";

interface TrainSearchProps {
  handleLevel: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleGender: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleLocation: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleClear: () => void;
  playerLevelId: number;
  gender: string;
  locationId: number;
}
const TrainSearch = (props: TrainSearchProps) => {
  const {
    handleLevel,
    handleGender,
    handleLocation,
    handleClear,
    playerLevelId,
    gender,
    locationId,
  } = props;

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const { data: playerLevels, isLoading: isPlayerLevelsLoading } =
    useGetPlayerLevelsQuery({});

  if (isLocationsLoading || isPlayerLevelsLoading) {
    return <div>Yükleniyor..</div>;
  }

  return (
    <div className={styles["training-page-container"]}>
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
        <select onChange={handleGender} value={gender}>
          <option value="">-- Cinsiyet --</option>
          <option value="female">Kadın</option>
          <option value="male">Erkek</option>
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
      <button onClick={handleClear} className={styles["button"]}>
        Temizle
      </button>
    </div>
  );
};

export default TrainSearch;
