import React, { useState, ChangeEvent } from "react";

import styles from "./styles.module.scss";

import PlayersLeaderboardResults from "../../components/leaderboard/leaderboard/PlayersLeaderboardResults";
import PlayersLeaderBoardSearch from "../../components/leaderboard/search/PlayersLeaderBoardSearch";

const PlayersLeaderboard = () => {
  const [textSearch, setTextSearch] = useState<string>("");
  const [playerLevelId, setPlayerLevelId] = useState<number | null>(null);
  const [locationId, setLocationId] = useState<number | null>(null);
  const [favourite, setFavourite] = useState<boolean | null>(false);

  const handleTextSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setTextSearch(event.target.value);
  };

  const handleLevel = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setPlayerLevelId(isNaN(value) ? null : value);
  };

  const handleLocation = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setLocationId(isNaN(value) ? null : value);
  };

  const handleFavourite = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setFavourite(value === "true");
  };
  return (
    <div className={styles["leaderboard-container"]}>
      <PlayersLeaderBoardSearch
        handleLevel={handleLevel}
        handleTextSearch={handleTextSearch}
        handleLocation={handleLocation}
        handleFavourite={handleFavourite}
        playerLevelId={playerLevelId}
        textSearch={textSearch}
        locationId={locationId}
        favourite={favourite}
      />
      <PlayersLeaderboardResults
        playerLevelId={playerLevelId}
        textSearch={textSearch}
        locationId={locationId}
        favourite={favourite}
      />
    </div>
  );
};

export default PlayersLeaderboard;
