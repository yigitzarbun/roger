import React, { useState, ChangeEvent } from "react";
import { User } from "../../../store/slices/authSlice";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { FaFilter } from "react-icons/fa6";
import { imageUrl } from "../../../common/constants/apiConstants";
import { BsInfoCircleFill } from "react-icons/bs";

import styles from "./styles.module.scss";
import { getAge } from "../../../common/util/TimeFunctions";
import Paths from "../../../routing/Paths";
import { Link } from "react-router-dom";
import TournamentPlayersFilterModal from "./filter/TournamentPlayersFilterModal";

interface TournamentDetailProps {
  tournamentDetails: any;
  textSearch: string;
  playerLevelId: number;
  handleTextSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  handlePlayerLevel: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleTournamentPage: (e: any) => void;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  playerLevels: any[];
  currentPage: number;
  handleClear: () => void;
}
const TournamentDetail = (props: TournamentDetailProps) => {
  const {
    tournamentDetails,
    textSearch,
    playerLevelId,
    handleTextSearch,
    handlePlayerLevel,
    handleTournamentPage,
    handleNextPage,
    handlePrevPage,
    playerLevels,
    currentPage,
    handleClear,
  } = props;

  const [openTournamentPlayersFilter, setOpenTournamentPlayersFilter] =
    useState(false);

  const handleOpenTournamentFilter = () => {
    setOpenTournamentPlayersFilter(true);
  };

  const closeTournamentPlayersFilter = () => {
    setOpenTournamentPlayersFilter(false);
  };

  const pageNumbers = [];
  for (let i = 1; i <= tournamentDetails?.totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <div className={styles["title-container"]}>
          {tournamentDetails?.players?.length > 0 && (
            <h2 className={styles["result-title"]}>
              {`${tournamentDetails?.tournament?.tournament_name} Katılımcıları`}
            </h2>
          )}

          {tournamentDetails?.players?.length > 0 && (
            <FaFilter
              onClick={handleOpenTournamentFilter}
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
              <th>Sıralama</th>
              <th>Oyuncu</th>
              <th>İsim</th>
              <th>Toplam Maç</th>
              <th>Kazandığı</th>
              <th>Kaybettiği</th>
              <th>Puan</th>
              <th>Seviye</th>
              <th>Yaş</th>
            </tr>
          </thead>
          <tbody>
            {tournamentDetails?.players?.map((player, rank) => (
              <tr key={player.player_user_id} className={styles["player-row"]}>
                <td>{rank + 1}</td>
                <td>
                  <Link
                    to={`${Paths.EXPLORE_PROFILE}1/${player.player_user_id} `}
                  >
                    <img
                      src={
                        player.image
                          ? `${imageUrl}/${player?.image}`
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

                <td>{player.totalmatches}</td>
                <td>{player.wonmatches}</td>
                <td>{player.lostmatches}</td>
                <td>{player.playerpoints}</td>
                <td>{player.player_level_name}</td>
                <td>{getAge(player.birth_year)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Henüz turnuva katılımcısı bulunmamaktadır</p>
      )}

      {openTournamentPlayersFilter && (
        <TournamentPlayersFilterModal
          textSearch={textSearch}
          handleTextSearch={handleTextSearch}
          handleClear={handleClear}
          playerLevelId={playerLevelId}
          handlePlayerLevel={handlePlayerLevel}
          playerLevels={playerLevels}
          openTournamentPlayersFilter={openTournamentPlayersFilter}
          closeTournamentPlayersFilter={closeTournamentPlayersFilter}
        />
      )}
      <div className={styles["pages-container"]}>
        {pageNumbers?.map((pageNumber) => (
          <button
            key={pageNumber}
            value={pageNumber}
            onClick={handleTournamentPage}
            className={
              pageNumber === Number(currentPage)
                ? styles["active-page"]
                : styles["passive-page"]
            }
          >
            {pageNumber}
          </button>
        ))}
      </div>
      {tournamentDetails?.players?.length > 0 && (
        <div className={styles["info-container"]}>
          <BsInfoCircleFill className={styles.icon} />
          <p>
            Toplam Maç, Kazandığı Maç, Kaybettiği Maç ve Puan bilgileri,
            <br />
            oyuncuların platform üzerindeki genel performans göstergeleridir.
          </p>
        </div>
      )}
    </div>
  );
};
export default TournamentDetail;
