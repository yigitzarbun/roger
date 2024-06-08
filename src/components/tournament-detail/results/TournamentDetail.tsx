import React, { useState, ChangeEvent } from "react";
import { User } from "../../../store/slices/authSlice";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { FaFilter } from "react-icons/fa6";
import { localUrl } from "../../../common/constants/apiConstants";

import styles from "./styles.module.scss";
import { getAge } from "../../../common/util/TimeFunctions";
import Paths from "../../../routing/Paths";
import { Link } from "react-router-dom";

interface TournamentDetailProps {
  tournamentDetails: any;
  user: User;
  textSearch: string;
  playerLevelId: number;
  handleTextSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  handlePlayerLevel: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleTournamentPage: (e: any) => void;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  playerLevels: any[];
  currentPage: number;
}
const TournamentDetail = (props: TournamentDetailProps) => {
  const {
    tournamentDetails,
    user,
    textSearch,
    playerLevelId,
    handleTextSearch,
    handlePlayerLevel,
    handleTournamentPage,
    handleNextPage,
    handlePrevPage,
    playerLevels,
    currentPage,
  } = props;
  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <div className={styles["title-container"]}>
          <h2 className={styles["result-title"]}>
            {tournamentDetails?.tournament?.tournament_name}
          </h2>
          {tournamentDetails?.tournaments?.length > 0 && (
            <FaFilter
              className={
                textSearch !== "" ? styles["active-filter"] : styles.filter
              }
            />
          )}
        </div>
        {tournamentDetails?.totalPages > 1 && (
          <div className={styles["navigation-container"]}>
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
      {tournamentDetails?.players?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Oyuncu</th>
              <th>İsim</th>
              <th>Sıralama</th>
              <th>Puan</th>
              <th>Seviye</th>
              <th>Yaş</th>
            </tr>
          </thead>
          <tbody>
            {tournamentDetails?.players?.map((player) => (
              <tr key={player.player_user_id} className={styles["player-row"]}>
                <td>
                  <Link
                    to={`${Paths.EXPLORE_PROFILE}1/${player.player_user_id} `}
                  >
                    <img
                      src={
                        player.image
                          ? `${localUrl}/${player?.image}`
                          : "/images/icons/avatar.jpg"
                      }
                      alt="player-image"
                      className={styles["player-image"]}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${Paths.EXPLORE_PROFILE}1/${player.player_user_id} `}
                    className={styles["player-name"]}
                  >{`${player.fname} ${player.lname}`}</Link>
                </td>
                <td>1</td>
                <td>91</td>
                <td>{player.player_level_name}</td>
                <td>{getAge(player.birth_year)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Güncel turnuva bulunmamaktadır</p>
      )}
    </div>
  );
};
export default TournamentDetail;
