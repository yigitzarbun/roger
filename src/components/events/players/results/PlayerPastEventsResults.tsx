import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import paths from "../../../../routing/Paths";

import { useAppSelector } from "../../../../store/hooks";

import styles from "./styles.module.scss";

import AddEventReviewModal from "../../reviews-modals/add/AddEventReviewModal";
import ViewEventReviewModal from "../../reviews-modals/view/ViewEventReviewModal";
import PageLoading from "../../../../components/loading/PageLoading";

import { useGetPlayerPastEventsQuery } from "../../../../api/endpoints/BookingsApi";
import { useGetEventReviewsByFilterQuery } from "../../../../api/endpoints/EventReviewsApi";

const PlayerPastEventsResults = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const { data: myEvents, isLoading: isBookingsLoading } =
    useGetPlayerPastEventsQuery(user?.user?.user_id);
  console.log(myEvents);
  const {
    data: eventReviews,
    isLoading: isEventReviewsLoading,
    refetch: refetchReviews,
  } = useGetEventReviewsByFilterQuery({
    user_id: user?.user?.user_id,
  });

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

  if (isBookingsLoading || isEventReviewsLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["title-container"]}>
        <h2 className={styles.title}>Geçmiş Etkinlikler</h2>
      </div>
      {myEvents?.length > 0 ? (
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
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {myEvents?.map((event) => (
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
                      <p className={styles["review-sent-text"]}>
                        Yorum Gönderildi
                      </p>
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
                </td>
                <td>
                  {(event.event_type_id === 1 ||
                    event.event_type_id === 2 ||
                    event.event_type_id === 3) &&
                    eventReviews?.find(
                      (review) =>
                        review.reviewee_id === user?.user?.user_id &&
                        review.booking_id === event.booking_id
                    ) && (
                      <button
                        className={styles["view-button"]}
                        onClick={() => openViewReviewModal(event.booking_id)}
                      >
                        Yorum Görüntüle
                      </button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Tamamlanmış etkinlik bulunmamaktadır</p>
      )}
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
    </div>
  );
};

export default PlayerPastEventsResults;
