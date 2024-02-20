import React, { useEffect, useState, ChangeEvent } from "react";

import { Link } from "react-router-dom";

import paths from "../../../../routing/Paths";

import { useAppSelector } from "../../../../store/hooks";
import { FaFilter } from "react-icons/fa6";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { ImBlocked } from "react-icons/im";
import { IoIosCheckmarkCircle } from "react-icons/io";

import styles from "./styles.module.scss";

import AddEventReviewModal from "../../reviews-modals/add/AddEventReviewModal";
import ViewEventReviewModal from "../../reviews-modals/view/ViewEventReviewModal";
import PageLoading from "../../../../components/loading/PageLoading";

import { useGetPlayerPastEventsQuery } from "../../../../api/endpoints/BookingsApi";
import { useGetEventReviewsByFilterQuery } from "../../../../api/endpoints/EventReviewsApi";
import { Club } from "../../../../api/endpoints/ClubsApi";
import { CourtStructureType } from "api/endpoints/CourtStructureTypesApi";
import { CourtSurfaceType } from "api/endpoints/CourtSurfaceTypesApi";
import PlayerPastEventsFilterModal from "../results-filter/PlayerPastEventsFilterModal";

interface PlayerPastEventsResultsProps {
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
const PlayerPastEventsResults = (props: PlayerPastEventsResultsProps) => {
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
    data: myEvents,
    isLoading: isBookingsLoading,
    refetch: refetchMyEvents,
  } = useGetPlayerPastEventsQuery({
    userId: user?.user?.user_id,
    clubId: clubId,
    textSearch: textSearch,
    courtSurfaceTypeId: courtSurfaceTypeId,
    courtStructureTypeId: courtStructureTypeId,
    eventTypeId: eventTypeId,
    currentPage: currentPage,
  });

  const {
    data: eventReviews,
    isLoading: isEventReviewsLoading,
    refetch: refetchReviews,
  } = useGetEventReviewsByFilterQuery({
    user_id: user?.user?.user_id,
  });

  const pageNumbers = [];
  for (let i = 1; i <= myEvents?.totalPages; i++) {
    pageNumbers.push(i);
  }
  const handleEventPage = (e) => {
    setCurrentPage(Number(e.target.value));
  };

  const handleNextPage = () => {
    const nextPage = (currentPage % myEvents?.totalPages) + 1;
    setCurrentPage(nextPage);
  };

  const handlePrevPage = () => {
    const prevPage =
      ((currentPage - 2 + myEvents?.totalPages) % myEvents?.totalPages) + 1;
    setCurrentPage(prevPage);
  };

  const [isPastEventsModalOpen, setIsPastEventsModalOpen] = useState(false);
  const handleOpenPastEventsModal = () => {
    setIsPastEventsModalOpen(true);
  };
  const handleClosePastEventsModal = () => {
    setIsPastEventsModalOpen(false);
  };

  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
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

  const [isViewReviewModalOpen, setIsViewReviewModalOpen] = useState(false);
  const openViewReviewModal = (booking_id: number) => {
    setSelectedBookingId(booking_id);
    setIsViewReviewModalOpen(true);
  };
  const closeViewReviewModal = () => {
    setIsViewReviewModalOpen(false);
  };

  useEffect(() => {
    if (isAddReviewModalOpen === false) {
      refetchReviews();
    }
  }, [isAddReviewModalOpen]);

  useEffect(() => {
    refetchMyEvents();
  }, [
    clubId,
    textSearch,
    courtSurfaceTypeId,
    courtStructureTypeId,
    eventTypeId,
    currentPage,
  ]);

  if (isBookingsLoading || isEventReviewsLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <div className={styles["title-container"]}>
          <h2 className={styles.title}>Geçmiş Etkinlikler</h2>
          <FaFilter
            onClick={handleOpenPastEventsModal}
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
      {myEvents?.pastEvents?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th></th>
              <th>İsim</th>
              <th>Tarih</th>
              <th>Saat</th>
              <th>Tür</th>
              <th>Konum</th>
              <th>Kort</th>
              <th>Yüzey</th>
              <th>Mekan</th>
              <th>Yorum Yap</th>
              <th>Yorum Görüntüle</th>
            </tr>
          </thead>
          <tbody>
            {myEvents?.pastEvents?.map((event) => (
              <tr key={event.booking_id} className={styles["player-row"]}>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}${
                      event.event_type_id === 1 || event.event_type_id === 2
                        ? 1
                        : event.event_type_id === 3
                        ? 3
                        : event.event_type_id === 6
                        ? 3
                        : ""
                    }/${
                      (event.event_type_id === 1 ||
                        event.event_type_id === 2 ||
                        event.event_type_id === 3) &&
                      event.inviter_id === user?.user?.user_id
                        ? event.invitee_id
                        : (event.event_type_id === 1 ||
                            event.event_type_id === 2 ||
                            event.event_type_id === 3) &&
                          event.invitee_id === user?.user?.user_id
                        ? event.inviter_id
                        : event.event_type_id === 6
                        ? event?.clubUserId
                        : ""
                    }`}
                  >
                    <img
                      src={
                        event?.playerImage &&
                        (event?.event_type_id === 1 ||
                          event?.event_type_id === 2)
                          ? event?.playerImage
                          : event?.trainerImage && event?.event_type_id === 3
                          ? event?.trainerImage
                          : event?.clubImage && event?.event_type_id === 6
                          ? event?.clubImage
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
                      event.event_type_id === 1 || event.event_type_id === 2
                        ? 1
                        : event.event_type_id === 3
                        ? 3
                        : event.event_type_id === 6
                        ? 3
                        : ""
                    }/${
                      (event.event_type_id === 1 ||
                        event.event_type_id === 2 ||
                        event.event_type_id === 3) &&
                      event.inviter_id === user?.user?.user_id
                        ? event.invitee_id
                        : (event.event_type_id === 1 ||
                            event.event_type_id === 2 ||
                            event.event_type_id === 3) &&
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
                      ? `${event?.fname} ${event?.lname}`
                      : event.event_type_id === 6
                      ? event?.student_group_name
                      : ""}
                  </Link>
                </td>
                <td>{event.event_date.slice(0, 10)}</td>
                <td>{event.event_time.slice(0, 5)}</td>
                <td>{event?.event_type_name}</td>
                <td>{event?.club_name}</td>
                <td>{event?.court_name}</td>
                <td>{event?.court_surface_type_name}</td>
                <td>{event?.court_structure_type_name}</td>
                <td>
                  {(event.event_type_id === 1 ||
                    event.event_type_id === 2 ||
                    event.event_type_id === 3) &&
                    (eventReviews?.find(
                      (review) =>
                        review.reviewer_id === user?.user?.user_id &&
                        review.booking_id === event.booking_id
                    ) ? (
                      <IoIosCheckmarkCircle className={styles.done} />
                    ) : (
                      <button
                        className={styles["comment-button"]}
                        onClick={() =>
                          openReviewModal(
                            event.booking_id,
                            event.fname,
                            event.lname,
                            event.image
                          )
                        }
                      >
                        Yorum Yap
                      </button>
                    ))}
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
                      review.booking_id === event.booking_id
                  ) ? (
                    <button
                      className={styles["view-button"]}
                      onClick={() => openViewReviewModal(event.booking_id)}
                    >
                      Yorum Görüntüle
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
          isPastEventsModalOpen={isPastEventsModalOpen}
          handleClosePastEventsModal={handleClosePastEventsModal}
          handleClear={handleClear}
        />
      )}
    </div>
  );
};

export default PlayerPastEventsResults;
