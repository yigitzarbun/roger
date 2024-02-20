import React, { useEffect, useState, ChangeEvent } from "react";

import { Link } from "react-router-dom";

import paths from "../../../../routing/Paths";

import { useAppSelector } from "../../../../store/hooks";
import { FaFilter } from "react-icons/fa6";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { IoIosCheckmarkCircle } from "react-icons/io";

import styles from "./styles.module.scss";

import { useGetPlayerMatchScoresWithBookingDetailsQuery } from "../../../../api/endpoints/MatchScoresApi";
import { Club } from "../../../../api/endpoints/ClubsApi";
import { CourtStructureType } from "api/endpoints/CourtStructureTypesApi";
import { CourtSurfaceType } from "api/endpoints/CourtSurfaceTypesApi";
import AddMatchScoreModal from "../modals/add/AddMatchScoreModal";
import EditMatchScoreModal from "../modals/edit/EditMatchScoreModal";
import PageLoading from "../../../../components/loading/PageLoading";
import PlayerPastEventsFilterModal from "../results-filter/PlayerPastEventsFilterModal";

interface PlayerMatchScoressProps {
  clubId: number;
  textSearch: string;
  courtSurfaceTypeId: number;
  courtStructureTypeId: number;
  eventTypeId: number;
  clubs: Club[];
  courtStructureTypes: CourtStructureType[];
  courtSurfaceTypes: CourtSurfaceType[];
  eventTypes: any;
  handleClub: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleCourtStructure: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleCourtSurface: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleEventType: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleTextSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  handleClear: () => void;
}

const PlayerScores = (props: PlayerMatchScoressProps) => {
  const user = useAppSelector((store) => store?.user?.user);
  const {
    clubId,
    textSearch,
    courtSurfaceTypeId,
    courtStructureTypeId,
    eventTypeId,
    clubs,
    courtStructureTypes,
    courtSurfaceTypes,
    eventTypes,
    handleClub,
    handleCourtStructure,
    handleCourtSurface,
    handleTextSearch,
    handleEventType,
    handleClear,
  } = props;
  const [currentPage, setCurrentPage] = useState(1);

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

  const [isAddScoreModalOpen, setIsAddScoreModalOpen] = useState(false);

  const [isEditScoreModalOpen, setIsEditScoreModalOpen] = useState(false);

  const [selectedMatchScore, setSelectedMatchScore] = useState(null);

  const [isMatchScoresFilterModalOpen, setIsMatchScoresFilterModalOpen] =
    useState(false);
  const handleOpenMatchScoresFilterModal = () => {
    setIsMatchScoresFilterModalOpen(true);
  };

  const handleCloseMatchScoresFilterModal = () => {
    setIsMatchScoresFilterModalOpen(false);
  };

  const openAddScoreModal = (matchScoreDetails) => {
    setIsAddScoreModalOpen(true);
    setSelectedMatchScore(matchScoreDetails);
  };

  const closeAddScoreModal = () => {
    setIsAddScoreModalOpen(false);
  };

  const openEditScoreModal = (matchScoreDetails) => {
    setIsEditScoreModalOpen(true);
    setSelectedMatchScore(matchScoreDetails);
  };

  const closeEditScoreModal = () => {
    setIsEditScoreModalOpen(false);
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
  ]);

  if (isMatchScoresLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <div className={styles["title-container"]}>
          <h2 className={styles.title}>Maç Skorları</h2>
          <FaFilter
            onClick={handleOpenMatchScoresFilterModal}
            className={styles.filter}
          />
        </div>
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
      </div>
      {matchScores?.matchScores?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th></th>
              <th>İsim</th>
              <th>Seviye</th>
              <th>Tarih</th>
              <th>Saat</th>
              <th>Tür</th>
              <th>Konum</th>
              <th>Kort</th>
              <th>Yüzey</th>
              <th>Mekan</th>
              <th>Skor</th>
              <th>Kazanan</th>
              <th>Skor Onay</th>
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
                          ? event.playerImage
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
                <td>{event?.player_level_name}</td>
                <td>{event.event_date.slice(0, 10)}</td>
                <td>{event.event_time.slice(0, 5)}</td>
                <td>{event?.event_type_name}</td>
                <td>{event?.club_name}</td>
                <td>{event?.court_name}</td>
                <td>{event?.court_surface_type_name}</td>
                <td>{event?.court_structure_type_name}</td>
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
                  {event?.match_score_status_type_id === 1 ? (
                    <button
                      onClick={() => openAddScoreModal(event)}
                      className={styles["add-score-button"]}
                    >
                      Skor Paylaş
                    </button>
                  ) : event.reporter_id === user?.user?.user_id &&
                    event?.match_score_status_type_id === 2 ? (
                    <p className={styles["waiting-confirmation-text"]}>
                      Onay Bekleniyor
                    </p>
                  ) : event.reporter_id !== user?.user?.user_id &&
                    event?.match_score_status_type_id === 2 ? (
                    <button
                      onClick={() => openEditScoreModal(event)}
                      className={styles["edit-score-button"]}
                    >
                      Onayla / Düzelt
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
        <p>Tamamlanan etkinlik bulunmamaktadır</p>
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
          textSearch={textSearch}
          clubId={clubId}
          courtSurfaceTypeId={courtSurfaceTypeId}
          courtStructureTypeId={courtStructureTypeId}
          eventTypeId={eventTypeId}
          clubs={clubs}
          courtStructureTypes={courtStructureTypes}
          courtSurfaceTypes={courtSurfaceTypes}
          eventTypes={eventTypes}
          handleTextSearch={handleTextSearch}
          handleClub={handleClub}
          handleCourtStructure={handleCourtStructure}
          handleCourtSurface={handleCourtSurface}
          handleEventType={handleEventType}
          isPastEventsModalOpen={isMatchScoresFilterModalOpen}
          handleClosePastEventsModal={handleCloseMatchScoresFilterModal}
          handleClear={handleClear}
        />
      )}
    </div>
  );
};

export default PlayerScores;
