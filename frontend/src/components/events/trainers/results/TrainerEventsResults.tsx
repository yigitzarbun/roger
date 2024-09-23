import React, { useState, useEffect, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import paths from "../../../../routing/Paths";
import { useAppSelector } from "../../../../store/hooks";
import { ImBlocked } from "react-icons/im";
import { IoIosCheckmarkCircle } from "react-icons/io";
import styles from "./styles.module.scss";
import { FaFilter } from "react-icons/fa6";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import AddEventReviewModal from "../../reviews-modals/add/AddEventReviewModal";
import ViewEventReviewModal from "../../reviews-modals/view/ViewEventReviewModal";
import PageLoading from "../../../../components/loading/PageLoading";
import { Club } from "../../../../../api/endpoints/ClubsApi";
import { CourtStructureType } from "../../../../../api/endpoints/CourtStructureTypesApi";
import { CourtSurfaceType } from "../../../../../api/endpoints/CourtSurfaceTypesApi";
import { useGetTrainerPastEventsQuery } from "../../../../../api/endpoints/BookingsApi";
import { useGetEventReviewsQuery } from "../../../../../api/endpoints/EventReviewsApi";
import TrainerPastEventsFilterModal from "./results-filter/TrainerPastEventsFilterModal";
import { imageUrl } from "../../../../common/constants/apiConstants";

interface TrainerEventsResultsProps {
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
  handleClub: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleCourtStructure: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleCourtSurface: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleEventType: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleTextSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  handleMissingReviews: () => void;
  handleClear: () => void;
}
const TrainerEventsResults = (props: TrainerEventsResultsProps) => {
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
    missingReviews,
    handleClub,
    handleCourtStructure,
    handleCourtSurface,
    handleTextSearch,
    handleEventType,
    handleMissingReviews,
    handleClear,
  } = props;

  const { t } = useTranslation();

  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);

  const [fname, setFname] = useState("");

  const [lname, setLname] = useState("");

  const [image, setImage] = useState(null);

  const openReviewModal = (
    booking_id: number,
    fname: string,
    lname: string,
    image: string | null
  ) => {
    setSelectedBookingId(booking_id);
    setFname(fname);
    setLname(lname);
    setImage(image);
    setIsAddReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsAddReviewModalOpen(false);
  };

  const [isPastEventsModalOpen, setIsPastEventsModalOpen] = useState(false);

  const handleOpenPastEventsModal = () => {
    setIsPastEventsModalOpen(true);
  };

  const handleClosePastEventsModal = () => {
    setIsPastEventsModalOpen(false);
  };

  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: trainerPastEvents,
    isLoading: isTrainerPastEventsLoading,
    refetch: refetchTrainerPastEvents,
  } = useGetTrainerPastEventsQuery({
    userId: user?.user?.user_id,
    clubId: clubId,
    textSearch: textSearch,
    courtSurfaceTypeId: courtSurfaceTypeId,
    courtStructureTypeId: courtStructureTypeId,
    eventTypeId: eventTypeId,
    currentPage: currentPage,
    missingReviews: missingReviews,
  });

  const pageNumbers = [];

  for (let i = 1; i <= trainerPastEvents?.totalPages; i++) {
    pageNumbers.push(i);
  }

  const handleEventPage = (e) => {
    setCurrentPage(Number(e.target.value));
  };

  const handleNextPage = () => {
    const nextPage = (currentPage % trainerPastEvents?.totalPages) + 1;
    setCurrentPage(nextPage);
  };

  const handlePrevPage = () => {
    const prevPage =
      ((currentPage - 2 + trainerPastEvents?.totalPages) %
        trainerPastEvents?.totalPages) +
      1;
    setCurrentPage(prevPage);
  };

  const { data: eventReviews, isLoading: isEventReviewsLoading } =
    useGetEventReviewsQuery({});

  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const [isViewReviewModalOpen, setIsViewReviewModalOpen] = useState(false);

  const openViewReviewModal = (booking_id: number) => {
    setSelectedBookingId(booking_id);
    setIsViewReviewModalOpen(true);
  };

  const closeViewReviewModal = () => {
    setIsViewReviewModalOpen(false);
  };

  useEffect(() => {
    refetchTrainerPastEvents();
  }, [
    textSearch,
    clubId,
    courtStructureTypeId,
    courtStructureTypeId,
    eventTypeId,
    missingReviews,
    currentPage,
    isAddReviewModalOpen,
  ]);

  if (isTrainerPastEventsLoading || isEventReviewsLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <div className={styles["title-container"]}>
          <h2 className={styles.title}>{t("pastEventsTitle")}</h2>
          <FaFilter
            onClick={handleOpenPastEventsModal}
            className={styles.filter}
          />
        </div>
        {trainerPastEvents?.totalPages > 1 && (
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
      {trainerPastEvents?.pastEvents?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>{t("leaderboardTablePlayerHeader")}</th>
              <th>{t("tableNameHeader")}</th>
              <th>{t("tableDateHeader")}</th>
              <th>{t("tableTimeHeader")}</th>
              <th>{t("tableClubTypeHeader")}</th>
              <th>{t("leaderboardTableLocationHeader")}</th>
              <th>{t("tableCourtHeader")}</th>
              <th>{t("tableSurfaceHeader")}</th>
              <th>{t("tableStructureHeader")}</th>
              <th>{t("tableReviewHeader")}</th>
              <th>{t("tableViewReviewHeader")}</th>
            </tr>
          </thead>
          <tbody>
            {trainerPastEvents?.pastEvents?.map((event) => (
              <tr key={event.booking_id} className={styles["player-row"]}>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}${
                      event.event_type_id === 3
                        ? 1
                        : event.event_type_id === 6
                        ? 3
                        : ""
                    }/${
                      event.event_type_id === 3 &&
                      event.inviter_id === user?.user?.user_id
                        ? event.invitee_id
                        : event.event_type_id === 3 &&
                          event.invitee_id === user?.user?.user_id
                        ? event.inviter_id
                        : event.event_type_id === 6
                        ? event?.clubUserId
                        : ""
                    }`}
                  >
                    <img
                      src={
                        event?.playerImage && event?.event_type_id === 3
                          ? `${imageUrl}/${event?.playerImage}`
                          : event?.clubImage && event?.event_type_id === 6
                          ? `${imageUrl}/${event?.clubImage}`
                          : "/images/icons/avatar.jpg"
                      }
                      className={styles["player-image"]}
                      alt="player-image"
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}${
                      event.event_type_id === 3
                        ? 1
                        : event.event_type_id === 6
                        ? 3
                        : ""
                    }/${
                      event.event_type_id === 3 &&
                      event.inviter_id === user?.user?.user_id
                        ? event.invitee_id
                        : event.event_type_id === 3 &&
                          event.invitee_id === user?.user?.user_id
                        ? event.inviter_id
                        : event.event_type_id === 6
                        ? event?.clubUserId
                        : ""
                    }`}
                    className={styles["player-name"]}
                  >
                    {event.event_type_id === 1 ||
                    event.event_type_id === 2 ||
                    event.event_type_id === 3
                      ? `${event?.playerFname} ${event?.playerLname}`
                      : event.event_type_id === 6
                      ? event?.student_group_name
                      : ""}
                  </Link>
                </td>
                <td>{event.event_date.slice(0, 10)}</td>
                <td>{event.event_time.slice(0, 5)}</td>
                <td>
                  {event?.event_type_id === 1
                    ? t("training")
                    : event?.event_type_id === 2
                    ? t("match")
                    : event?.event_type_id === 3
                    ? t("lesson")
                    : event?.event_type_id === 4
                    ? t("externalTraining")
                    : event?.event_type_id === 5
                    ? t("externalLesson")
                    : event?.event_type_id === 6
                    ? t("groupLesson")
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
                  {event?.isEventReviewActive ? (
                    <IoIosCheckmarkCircle className={styles.done} />
                  ) : (
                    <button
                      className={styles["comment-button"]}
                      onClick={() =>
                        openReviewModal(
                          event.booking_id,
                          event.playerFname,
                          event.playerLname,
                          event.playerImage ? event.playerImage : null
                        )
                      }
                    >
                      {t("tableReviewHeader")}
                    </button>
                  )}
                  {event.event_type_id === 6 && (
                    <ImBlocked className={styles.blocked} />
                  )}
                </td>
                <td>
                  {(event.event_type_id === 1 ||
                    event.event_type_id === 2 ||
                    event.event_type_id === 3) &&
                  eventReviews?.find(
                    (review) =>
                      review.reviewee_id === user?.user?.user_id &&
                      review.booking_id === event.booking_id &&
                      review.is_active
                  ) ? (
                    <button
                      className={styles["view-button"]}
                      onClick={() => openViewReviewModal(event.booking_id)}
                    >
                      {t("tableViewReviewHeader")}
                    </button>
                  ) : (
                    <ImBlocked className={styles.blocked} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Tamamlanmış etkinlik bulunmamaktadır</p>
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
      {isAddReviewModalOpen && (
        <AddEventReviewModal
          isAddReviewModalOpen={isAddReviewModalOpen}
          closeReviewModal={closeReviewModal}
          selectedBookingId={selectedBookingId}
          fname={fname}
          lname={lname}
          image={image}
        />
      )}
      {isViewReviewModalOpen && (
        <ViewEventReviewModal
          isViewReviewModalOpen={isViewReviewModalOpen}
          closeViewReviewModal={closeViewReviewModal}
          selectedBookingId={selectedBookingId}
        />
      )}
      {isPastEventsModalOpen && (
        <TrainerPastEventsFilterModal
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
          handleTextSearch={handleTextSearch}
          handleClub={handleClub}
          handleCourtStructure={handleCourtStructure}
          handleCourtSurface={handleCourtSurface}
          handleEventType={handleEventType}
          isPastEventsModalOpen={isPastEventsModalOpen}
          handleClosePastEventsModal={handleClosePastEventsModal}
          handleMissingReviews={handleMissingReviews}
          handleClear={handleClear}
        />
      )}
    </div>
  );
};
export default TrainerEventsResults;
