import React, { useState, ChangeEvent, useEffect } from "react";
import styles from "./styles.module.scss";
import { FaFilter } from "react-icons/fa6";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { useGetPaginatedTournamentsQuery } from "../../../../api/endpoints/TournamentsApi";
import PageLoading from "../../../components/loading/PageLoading";
import AllTournamentsFilterModal from "./all-tournaments-filter/AllTournamentsFilterModal";
import { AddTournamentParticipantModal } from "../modals/add-tournament-participant-modal/AddTournamentParticipantModal";
import { Link } from "react-router-dom";
import Paths from "../../../routing/Paths";
import { useAppSelector } from "../../../store/hooks";
import { useTranslation } from "react-i18next";

interface AllTournamentsProps {
  refetchMyTournaments: () => void;
  locations: any[];
  clubs: any[];
}

const AllTournaments = (props: AllTournamentsProps) => {
  const { refetchMyTournaments, locations, clubs } = props;

  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);

  const [textSearch, setTextSearch] = useState("");

  const [locationId, setLocationId] = useState(null);

  const [gender, setGender] = useState("");

  const [clubId, setClubId] = useState(null);

  const [subscriptionRequired, setSubscriptionRequired] = useState(null);

  const user = useAppSelector((store) => store?.user?.user);

  const handleTextSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setTextSearch(event.target.value);
  };

  const handleLocation = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setLocationId(isNaN(value) ? null : value);
  };

  const handleClub = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setClubId(isNaN(value) ? null : value);
  };

  const handleGender = (event: ChangeEvent<HTMLSelectElement>) => {
    setGender(event.target.value);
  };

  const handleSubscriptionRequired = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setSubscriptionRequired(event.target.value);
  };

  const [allTournamentsFilterModal, setAllTournamentsFilterModal] =
    useState(false);

  const handleOpenAllTournamentsModal = () => {
    setAllTournamentsFilterModal(true);
  };

  const handleCloseAllTournamentsModal = () => {
    setAllTournamentsFilterModal(false);
  };

  const handleClear = () => {
    setTextSearch("");
    setLocationId(null);
    setGender("");
    setClubId(null);
    setSubscriptionRequired(null);
  };

  const {
    data: paginatedTournaments,
    isLoading: isPaginatedTournamentsLoading,
    refetch: refetchPaginatedTournaments,
  } = useGetPaginatedTournamentsQuery({
    currentPage: currentPage,
    textSearch: textSearch,
    locationId: locationId,
    gender: gender,
    clubUserId: clubId,
    subscriptionRequired: subscriptionRequired,
    player_user_id: user?.user?.user_id,
  });

  const pageNumbers = [];
  for (let i = 1; i <= paginatedTournaments?.totalPages; i++) {
    pageNumbers.push(i);
  }

  const handleTournamentPage = (e) => {
    setCurrentPage(e.target.value);
  };

  const handleNextPage = () => {
    const nextPage = (currentPage % paginatedTournaments?.totalPages) + 1;
    setCurrentPage(nextPage);
  };

  const handlePrevPage = () => {
    const prevPage =
      ((currentPage - 2 + paginatedTournaments?.totalPages) %
        paginatedTournaments?.totalPages) +
      1;
    setCurrentPage(prevPage);
  };
  const date = new Date();

  const currentYear = date.getFullYear();

  const [participateModal, setParticipateModal] = useState(false);

  const [selectedTournament, setSelectedTournament] = useState(null);

  const [selectedClubUserId, setSelectedClubUserId] = useState(null);

  const handleOpenAddTournamentParticipantModal = (
    tournament: any,
    clubUserId: number
  ) => {
    setSelectedTournament(tournament);
    setSelectedClubUserId(clubUserId);
    setParticipateModal(true);
  };

  const closeAddTournamentParticipantModal = () => {
    setParticipateModal(false);
  };

  useEffect(() => {
    refetchPaginatedTournaments();
  }, [
    currentPage,
    textSearch,
    locationId,
    gender,
    clubId,
    subscriptionRequired,
  ]);

  if (isPaginatedTournamentsLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <div className={styles["title-container"]}>
          <h2 className={styles["result-title"]}>{t("tournamentsTitle")}</h2>
          {paginatedTournaments?.tournaments?.length > 0 && (
            <FaFilter
              onClick={handleOpenAllTournamentsModal}
              className={
                textSearch !== "" ? styles["active-filter"] : styles.filter
              }
            />
          )}
        </div>
        {paginatedTournaments?.totalPages > 1 && (
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
      {paginatedTournaments?.tournaments?.length > 0 ? (
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
              <th>{t("participationStatus")}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTournaments?.tournaments?.map((tournament) => (
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
                  {tournament?.player_participation_status ===
                  "playerParticipantTrue" ? (
                    <IoIosCheckmarkCircle className={styles.done} />
                  ) : (
                    <button
                      onClick={() =>
                        handleOpenAddTournamentParticipantModal(
                          tournament,
                          tournament.clubUserId
                        )
                      }
                      className={styles["book-button"]}
                    >
                      {t("join")}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>{t("playerTournamentEmptyText")}</p>
      )}
      {allTournamentsFilterModal && (
        <AllTournamentsFilterModal
          textSearch={textSearch}
          handleTextSearch={handleTextSearch}
          handleClear={handleClear}
          allTournamentsFilterModal={allTournamentsFilterModal}
          handleCloseAllTournamentsModal={handleCloseAllTournamentsModal}
          handleLocation={handleLocation}
          handleGender={handleGender}
          handleSubscriptionRequired={handleSubscriptionRequired}
          gender={gender}
          locationId={locationId}
          clubId={clubId}
          subscriptionRequired={subscriptionRequired}
          locations={locations}
          handleClub={handleClub}
          clubs={clubs}
        />
      )}
      {participateModal && (
        <AddTournamentParticipantModal
          refetchPaginatedTournaments={refetchPaginatedTournaments}
          participateModal={participateModal}
          closeAddTournamentParticipantModal={
            closeAddTournamentParticipantModal
          }
          selectedTournament={selectedTournament}
          selectedClubUserId={selectedClubUserId}
          refetchMyTournaments={refetchMyTournaments}
        />
      )}
      {pageNumbers.length > 0 && (
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
      )}
    </div>
  );
};

export default AllTournaments;
