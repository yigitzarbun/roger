import React, { useEffect, useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import paths from "../../../../routing/Paths";
import { useAppSelector } from "../../../../store/hooks";
import { FaFilter } from "react-icons/fa6";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { IoIosCheckmarkCircle } from "react-icons/io";
import styles from "./styles.module.scss";
import { useGetPlayerMatchScoresWithBookingDetailsQuery } from "../../../../../api/endpoints/MatchScoresApi";
import { Club } from "../../../../../api/endpoints/ClubsApi";
import { CourtStructureType } from "../../../../../api/endpoints/CourtStructureTypesApi";
import { CourtSurfaceType } from "../../../../../api/endpoints/CourtSurfaceTypesApi";
import AddMatchScoreModal from "../modals/add/AddMatchScoreModal";
import EditMatchScoreModal from "../modals/edit/EditMatchScoreModal";
import PageLoading from "../../../../components/loading/PageLoading";
import PlayerPastEventsFilterModal from "../results-filter/PlayerPastEventsFilterModal";
import { BsClockHistory } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { imageUrl } from "../../../../common/constants/apiConstants";

interface PlayerMatchScoressProps {
  display: string;
  clubId: number;
  textSearch: string;
  courtSurfaceTypeId: number;
  courtStructureTypeId: number;
  eventTypeId: number;
  clubs: Club[];
  courtStructureTypes: CourtStructureType[];
  courtSurfaceTypes: CourtSurfaceType[];
  eventTypes: any;
  missingReviews: number;
  missingScores: number;
  selectedMatchScore: number;
  isAddScoreModalOpen: boolean;
  isEditScoreModalOpen: boolean;
  handleClub: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleCourtStructure: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleCourtSurface: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleEventType: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleTextSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  handleMissingReviews: () => void;
  handleMissingScores: () => void;
  openAddScoreModal: (any) => void;
  closeAddScoreModal: () => void;
  openEditScoreModal: (any) => void;
  closeEditScoreModal: () => void;
  handleClear: () => void;
}

const PlayerScores = (props: PlayerMatchScoressProps) => {
  const user = useAppSelector((store) => store?.user?.user);
  const {
    display,
    clubId,
    textSearch,
    courtSurfaceTypeId,
    courtStructureTypeId,
    eventTypeId,
    clubs,
    courtStructureTypes,
    courtSurfaceTypes,
    eventTypes,
    missingReviews,
    missingScores,
    selectedMatchScore,
    isAddScoreModalOpen,
    isEditScoreModalOpen,
    openAddScoreModal,
    closeAddScoreModal,
    openEditScoreModal,
    closeEditScoreModal,
    handleClub,
    handleCourtStructure,
    handleCourtSurface,
    handleTextSearch,
    handleEventType,
    handleMissingReviews,
    handleMissingScores,
    handleClear,
  } = props;
  const [currentPage, setCurrentPage] = useState(1);

  const { t } = useTranslation();

  const {
    data: matchScores,
    isLoading: isMatchScoresLoading,
    refetch: refetchMatchScores,
  } = useGetPlayerMatchScoresWithBookingDetailsQuery({
    userId: user?.user?.user_id,
    clubId: clubId,
    textSearch: textSearch,
    courtSurfaceTypeId: courtSurfaceTypeId,
    courtStructureTypeId: courtStructureTypeId,
    eventTypeId: eventTypeId,
    currentPage: currentPage,
    missingScores: missingScores,
  });

  const pageNumbers = [];

  for (let i = 1; i <= matchScores?.totalPages; i++) {
    pageNumbers.push(i);
  }
  const handleEventPage = (e) => {
    setCurrentPage(Number(e.target.value));
  };

  const handleNextPage = () => {
    const nextPage = (currentPage % matchScores?.totalPages) + 1;
    setCurrentPage(nextPage);
  };

  const handlePrevPage = () => {
    const prevPage =
      ((currentPage - 2 + matchScores?.totalPages) % matchScores?.totalPages) +
      1;
    setCurrentPage(prevPage);
  };

  const [isMatchScoresFilterModalOpen, setIsMatchScoresFilterModalOpen] =
    useState(false);

  const handleOpenMatchScoresFilterModal = () => {
    setIsMatchScoresFilterModalOpen(true);
  };

  const handleCloseMatchScoresFilterModal = () => {
    setIsMatchScoresFilterModalOpen(false);
  };

  useEffect(() => {
    refetchMatchScores();
  }, [isAddScoreModalOpen, isEditScoreModalOpen]);

  useEffect(() => {
    refetchMatchScores();
  }, [
    clubId,
    textSearch,
    courtSurfaceTypeId,
    courtStructureTypeId,
    eventTypeId,
    currentPage,
    missingScores,
  ]);

  if (isMatchScoresLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <div className={styles["title-container"]}>
          <h2 className={styles.title}>{t("matchScoresTitle")}</h2>
          {matchScores?.matchScores?.length > 0 && (
            <FaFilter
              onClick={handleOpenMatchScoresFilterModal}
              className={styles.filter}
            />
          )}
        </div>
        {matchScores?.totalPages > 1 && (
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
      {matchScores?.matchScores?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>{t("tablePlayerHeader")}</th>
              <th>{t("tableNameHeader")}</th>
              <th>{t("tableLevelHeader")}</th>
              <th>{t("tableDateHeader")}</th>
              <th>{t("tableTimeHeader")}</th>
              <th>{t("tableClubTypeHeader")}</th>
              <th>{t("leaderboardTableLocationHeader")}</th>
              <th>{t("tableCourtHeader")}</th>
              <th>{t("tableSurfaceHeader")}</th>
              <th>{t("tableStructureHeader")}</th>
              <th>{t("tableScoreHeader")}</th>
              <th>{t("tableWinnerHeader")}</th>
              <th>{t("tableScoreApproveHeader")}</th>
            </tr>
          </thead>
          <tbody>
            {matchScores?.matchScores?.map((event) => (
              <tr key={event.booking_id} className={styles["player-row"]}>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}1/${
                      event.inviter_id === user?.user?.user_id
                        ? event.invitee_id
                        : event.inviter_id
                    }`}
                  >
                    <img
                      src={
                        event.playerImage
                          ? `${imageUrl}/${event?.playerImage}`
                          : "/images/icons/avatar.jpg"
                      }
                      alt={event.name}
                      className={styles["player-image"]}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}1/${
                      event.inviter_id === user?.user?.user_id
                        ? event.invitee_id
                        : event.inviter_id
                    }`}
                    className={styles["player-name"]}
                  >
                    {`${event?.fname} ${event?.lname}`}
                  </Link>
                </td>
                <td>
                  {event.player_level_id === 1
                    ? t("playerLevelBeginner")
                    : event?.player_level_id === 2
                    ? t("playerLevelIntermediate")
                    : event?.player_level_id === 3
                    ? t("playerLevelAdvanced")
                    : t("playerLevelProfessinal")}
                </td>
                <td>{event.event_date.slice(0, 10)}</td>
                <td>{event.event_time.slice(0, 5)}</td>
                <td>
                  {event?.event_type_id === 2
                    ? t("match")
                    : event?.event_type_id === 7
                    ? t("tournamentMatch")
                    : ""}
                </td>
                <td>{event?.club_name}</td>
                <td>{event?.court_name}</td>
                <td>
                  {event?.court_surface_type_id === 1
                    ? t("courtSurfaceHard")
                    : event?.court_surface_type_id === 2
                    ? t("courtSurfaceClay")
                    : event?.court_surface_type_id === 3
                    ? t("courtSurfaceGrass")
                    : t("courtSurfaceCarpet")}
                </td>
                <td>
                  {event?.court_structure_type_id === 1
                    ? t("courtStructureOpen")
                    : event?.court_structure_type_id === 2
                    ? t("courtStructureClosed")
                    : t("courtStructureHybrid")}
                </td>
                <td>
                  {matchScores?.matchScores?.find(
                    (match) =>
                      match.booking_id === event.booking_id &&
                      match.inviter_third_set_games_won === 0
                  )?.match_score_status_type_id === 3
                    ? `${event?.inviter_first_set_games_won}-${event?.invitee_first_set_games_won} ${event?.inviter_second_set_games_won}-${event?.invitee_second_set_games_won} `
                    : matchScores?.matchScores?.find(
                        (match) =>
                          match.booking_id === event.booking_id &&
                          match.match_score_status_type_id === 3 &&
                          match.inviter_third_set_games_won
                      )
                    ? `${event?.inviter_first_set_games_won}-${event?.invitee_first_set_games_won} ${event?.inviter_second_set_games_won}-${event?.invitee_second_set_games_won} ${event?.inviter_third_set_games_won}-${event?.invitee_third_set_games_won}`
                    : "-"}
                </td>
                <td>
                  {event?.match_score_status_type_id === 3 &&
                  event?.winner_id === user?.user?.user_id
                    ? `${user?.playerDetails?.fname} ${user?.playerDetails?.lname}`
                    : event?.match_score_status_type_id === 3 &&
                      event?.winner_id !== user?.user?.user_id
                    ? `${event?.fname} ${event?.lname}`
                    : "-"}
                </td>
                <td>
                  {event?.event_type_id === 7 &&
                  event?.match_score_status_type_id === 1 ? (
                    "-"
                  ) : event?.match_score_status_type_id === 1 &&
                    event?.event_type_id === 2 ? (
                    <button
                      onClick={() => openAddScoreModal(event)}
                      className={styles["add-score-button"]}
                    >
                      {t("tableAddScore")}{" "}
                    </button>
                  ) : event.reporter_id === user?.user?.user_id &&
                    event?.match_score_status_type_id === 2 ? (
                    <BsClockHistory
                      className={styles["waiting-confirmation-text"]}
                    />
                  ) : event.reporter_id !== user?.user?.user_id &&
                    event?.match_score_status_type_id === 2 ? (
                    <button
                      onClick={() => openEditScoreModal(event)}
                      className={styles["edit-score-button"]}
                    >
                      {t("reviewScore")}
                    </button>
                  ) : event?.match_score_status_type_id === 3 ? (
                    <IoIosCheckmarkCircle className={styles.done} />
                  ) : (
                    ""
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>{t("playerPastEventsEmptyText")}</p>
      )}
      <div className={styles["pages-container"]}>
        {pageNumbers?.map((pageNumber) => (
          <button
            key={pageNumber}
            value={pageNumber}
            onClick={handleEventPage}
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
      {isAddScoreModalOpen && (
        <AddMatchScoreModal
          isAddScoreModalOpen={isAddScoreModalOpen}
          closeAddScoreModal={closeAddScoreModal}
          selectedMatchScore={selectedMatchScore}
        />
      )}
      {isEditScoreModalOpen && (
        <EditMatchScoreModal
          isEditScoreModalOpen={isEditScoreModalOpen}
          closeEditScoreModal={closeEditScoreModal}
          selectedMatchScore={selectedMatchScore}
        />
      )}
      {isMatchScoresFilterModalOpen && (
        <PlayerPastEventsFilterModal
          display={display}
          textSearch={textSearch}
          clubId={clubId}
          courtSurfaceTypeId={courtSurfaceTypeId}
          courtStructureTypeId={courtStructureTypeId}
          eventTypeId={eventTypeId}
          clubs={clubs}
          courtStructureTypes={courtStructureTypes}
          courtSurfaceTypes={courtSurfaceTypes}
          eventTypes={eventTypes}
          missingReviews={missingReviews}
          missingScores={missingScores}
          handleTextSearch={handleTextSearch}
          handleClub={handleClub}
          handleCourtStructure={handleCourtStructure}
          handleCourtSurface={handleCourtSurface}
          handleEventType={handleEventType}
          handleMissingReviews={handleMissingReviews}
          handleMissingScores={handleMissingScores}
          isPastEventsModalOpen={isMatchScoresFilterModalOpen}
          handleClosePastEventsModal={handleCloseMatchScoresFilterModal}
          handleClear={handleClear}
        />
      )}
    </div>
  );
};

export default PlayerScores;
