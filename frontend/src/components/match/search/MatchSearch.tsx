import React, { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import { useGetLocationsQuery } from "../../../../api/endpoints/LocationsApi";
import { useGetPlayerLevelsQuery } from "../../../../api/endpoints/PlayerLevelsApi";
import PageLoading from "../../../components/loading/PageLoading";

interface MatchSearchProps {
  handleLevel: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleTextSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  handleLocation: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleFavourite: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleClear: () => void;
  playerLevelId: number;
  textSearch: string;
  locationId: number;
  favourite: boolean | null;
}

const MatchSearch = (props: MatchSearchProps) => {
  const {
    handleLevel,
    handleTextSearch,
    handleLocation,
    handleFavourite,
    handleClear,
    playerLevelId,
    textSearch,
    locationId,
    favourite,
  } = props;
  const { t } = useTranslation();

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const { data: playerLevels, isLoading: isPlayerLevelsLoading } =
    useGetPlayerLevelsQuery({});

  if (isLocationsLoading || isPlayerLevelsLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["match-page-container"]}>
      <div className={styles["search-container"]}>
        <input
          type="text"
          onChange={handleTextSearch}
          value={textSearch}
          placeholder={t("explorePlayersFilterSearchPlaceholder")}
        />
      </div>
      <div className={styles["input-container"]}>
        <select
          onChange={handleLevel}
          value={playerLevelId ?? ""}
          className="input-element"
        >
          <option value="">-- {t("playerLevel")} --</option>
          {playerLevels?.map((player_level) => (
            <option
              key={player_level.player_level_id}
              value={player_level.player_level_id}
            >
              {player_level.player_level_id === 1
                ? t("playerLevelBeginner")
                : player_level?.player_level_id === 2
                ? t("playerLevelIntermediate")
                : player_level?.player_level_id === 3
                ? t("playerLevelAdvanced")
                : t("playerLevelProfessinal")}
            </option>
          ))}
        </select>
      </div>
      <div className={styles["input-container"]}>
        <select
          onChange={handleLocation}
          value={locationId ?? ""}
          className="input-element"
        >
          <option value="">-- {t("allLocations")} --</option>
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
            -- {t("players")} --
          </option>
          <option key={2} value={"true"}>
            {t("onlyFavourites")}
          </option>
        </select>
      </div>
      <button
        onClick={handleClear}
        className={
          playerLevelId > 0 ||
          textSearch !== "" ||
          locationId > 0 ||
          favourite === true
            ? styles["active-clear-button"]
            : styles["passive-clear-button"]
        }
      >
        {t("clearButtonText")}
      </button>
    </div>
  );
};

export default MatchSearch;
