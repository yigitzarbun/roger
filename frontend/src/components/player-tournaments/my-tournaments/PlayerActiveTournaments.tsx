import React, { useState, ChangeEvent } from "react";
import styles from "./styles.module.scss";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { FaFilter } from "react-icons/fa6";
import MyTournamentsFilterModal from "./my-tournaments-filter/MyTournamentsFilterModal";
import LeaveTournamentModal from "../modals/leave-tournament-modal/LeaveTournamentModal";
import Paths from "../../../routing/Paths";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface PlayerActiveTournamentsProps {
  myTournaments: any;
  textSearch: string;
  locationId: number;
  clubId: number;
  handleTextSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  handleLocation: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleClub: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleTournamentPage: (e: any) => void;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  currentPage: number;
  locations: any[];
  handleClear: () => void;
  clubs: any[];
  refetchMyTournaments: () => void;
}
const PlayerActiveTournaments = (props: PlayerActiveTournamentsProps) => {
  const {
    myTournaments,
    textSearch,
    locationId,
    clubId,
    handleTextSearch,
    handleLocation,
    handleClub,
    handleTournamentPage,
    handleNextPage,
    handlePrevPage,
    currentPage,
    locations,
    handleClear,
    clubs,
    refetchMyTournaments,
  } = props;

  const { t } = useTranslation();

  const [myTournamentsFilterModal, setMyTournamentsFilterModal] =
    useState(false);

  const handleOpenMyTournamentsModal = () => {
    setMyTournamentsFilterModal(true);
  };

  const handleCloseMyTournamentsModal = () => {
    setMyTournamentsFilterModal(false);
  };

  const date = new Date();

  const currentYear = date.getFullYear();

  const [leaveModal, setLeaveModal] = useState(false);

  const [selectedTournament, setSelectedTournament] = useState(null);

  const handleOpenLeaveTournamentModal = (tournament: any) => {
    setSelectedTournament(tournament);
    setLeaveModal(true);
  };

  const closeLeaveTournamentModal = () => {
    setLeaveModal(false);
  };

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <div className={styles["title-container"]}>
          <h2 className={styles["result-title"]}>{t("myTournamentsTitle")}</h2>
          <FaFilter
            onClick={handleOpenMyTournamentsModal}
            className={
              textSearch !== "" ? styles["active-filter"] : styles.filter
            }
          />
        </div>
        {myTournaments?.totalPages > 1 && (
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
      {myTournaments?.tournaments?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>{t("tableTournamentName")}</th>
              <th>{t("tableClubHeader")}</th>
              <th>{t("leaderboardTableLocationHeader")}</th>
              <th>{t("start")}</th>
              <th>{t("end")}</th>
              <th>{t("deadline")}</th>
              <th>{t("admissionFee")}</th>
              <th>{t("tableGenderHeader")}</th>
              <th>{t("participants")}</th>
              <th>{t("membershipRule")}</th>
              <th>{t("ageGap")}</th>
            </tr>
          </thead>
          <tbody>
            {myTournaments?.tournaments?.map((tournament) => (
              <tr
                key={tournament.tournament_id}
                className={styles["tournament-row"]}
              >
                <td>
                  <Link
                    to={`${Paths.TOURNAMENT}${tournament.tournament_id}`}
                    className={styles["tournament-name"]}
                  >
                    {tournament.tournament_name}
                  </Link>
                </td>
                <td>{tournament.club_name}</td>
                <td>{tournament.location_name}</td>
                <td>{tournament.start_date?.slice(0, 10)}</td>
                <td>{tournament.end_date?.slice(0, 10)}</td>
                <td>{tournament.application_deadline?.slice(0, 10)}</td>
                <td>{`${tournament.application_fee} TL`}</td>
                <td>
                  {tournament.tournament_gender === "female"
                    ? t("female")
                    : t("male")}
                </td>
                <td>{tournament.participant_count}</td>
                <td>
                  {tournament.club_subscription_required ? t("yes") : t("no")}
                </td>
                <td>{`${currentYear - tournament?.min_birth_year} - ${
                  currentYear - tournament?.max_birth_year
                }`}</td>
                <td>
                  <button
                    onClick={() => handleOpenLeaveTournamentModal(tournament)}
                    className={styles["book-button"]}
                  >
                    {t("leaveTournament")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>{t("playerTournamentEmptyText")}</p>
      )}
      {myTournamentsFilterModal && (
        <MyTournamentsFilterModal
          textSearch={textSearch}
          handleTextSearch={handleTextSearch}
          handleClear={handleClear}
          myTournamentsFilterModal={myTournamentsFilterModal}
          handleCloseMyTournamentsModal={handleCloseMyTournamentsModal}
          handleLocation={handleLocation}
          locationId={locationId}
          clubId={clubId}
          locations={locations}
          handleClub={handleClub}
          clubs={clubs}
        />
      )}
      {leaveModal && (
        <LeaveTournamentModal
          leaveModal={leaveModal}
          closeLeaveTournamentModal={closeLeaveTournamentModal}
          selectedTournament={selectedTournament}
          refetchMyTournaments={refetchMyTournaments}
        />
      )}
    </div>
  );
};
export default PlayerActiveTournaments;
