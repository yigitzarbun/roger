import React, { ChangeEvent } from "react";

import styles from "./styles.module.scss";

import { useGetLocationsQuery } from "../../../api/endpoints/LocationsApi";
import { useGetPlayerLevelsQuery } from "../../../api/endpoints/PlayerLevelsApi";

import PageLoading from "../../../components/loading/PageLoading";

interface TrainSearchProps {
  handleLevel: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleTextSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  handleGender: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleLocation: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleFavourite: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleClear: () => void;
  playerLevelId: number;
  textSearch: string;
  gender: string;
  locationId: number;
  favourite: boolean | null;
}
const TrainSearch = (props: TrainSearchProps) => {
  const {
    handleLevel,
    handleTextSearch,
    handleGender,
    handleLocation,
    handleFavourite,
    handleClear,
    playerLevelId,
    textSearch,
    gender,
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
    <div className={styles["training-page-container"]}>
      <div className={styles["search-container"]}>
        <input
          type="text"
          onChange={handleTextSearch}
          value={textSearch}
          placeholder="Oyuncu adı"
        />
      </div>
      <div className={styles["input-container"]}>
        <select
          onChange={handleLevel}
          value={playerLevelId ?? ""}
          className="input-element"
        >
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
        <select
          onChange={handleGender}
          value={gender}
          className="input-element"
        >
          <option value="">-- Cinsiyet --</option>
          <option value="female">Kadın</option>
          <option value="male">Erkek</option>
        </select>
      </div>
      <div className={styles["input-container"]}>
        <select
          onChange={handleLocation}
          value={locationId ?? ""}
          className="input-element"
        >
          <option value="">-- Tüm Konumlar --</option>
          {locations?.map((location) => (
            <option key={location.location_id} value={location.location_id}>
              {location.location_name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles["input-container"]}>
        <select
          onChange={handleFavourite}
          value={favourite ? "true" : "false"}
          className="input-element"
        >
          <option key={1} value={"false"}>
            -- Tüm Oyuncular --
          </option>
          <option key={2} value={"true"}>
            Favoriler
          </option>
        </select>
      </div>
      <button
        onClick={handleClear}
        className={
          playerLevelId > 0 ||
          textSearch !== "" ||
          gender !== "" ||
          locationId > 0 ||
          favourite === true
            ? styles["active-clear-button"]
            : styles["passive-clear-button"]
        }
      >
        Temizle
      </button>
    </div>
  );
};

export default TrainSearch;
