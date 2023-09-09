import React from "react";

import { FaCircle } from "react-icons/fa";

import { NavLink } from "react-router-dom";

import paths from "../../../routing/Paths";

import styles from "./styles.module.scss";

import PageLoading from "../../../components/loading/PageLoading";

import { useAppSelector } from "../../../store/hooks";
import { useGetBookingsQuery } from "../../../api/endpoints/BookingsApi";
import { useGetEventReviewsQuery } from "../../../api/endpoints/EventReviewsApi";
import { useGetMatchScoresQuery } from "../../../api/endpoints/MatchScoresApi";

const PlayerHeader = () => {
  const user = useAppSelector((store) => store?.user?.user);
  const { data: bookings, isLoading: isBookingsLoading } = useGetBookingsQuery(
    {}
  );
  const { data: eventReviews, isLoading: isEventReviewsLoading } =
    useGetEventReviewsQuery({});
  const { data: scores, isLoading: isScoresLoading } = useGetMatchScoresQuery(
    {}
  );

  const date = new Date();
  const today = date.toLocaleDateString();
  const now = date.toLocaleTimeString();

  const incomingBookings = bookings?.filter(
    (booking) =>
      booking.invitee_id === user?.user?.user_id &&
      booking.booking_status_type_id === 1 &&
      (new Date(booking.event_date).toLocaleDateString() > today ||
        (new Date(booking.event_date).toLocaleDateString() === today &&
          booking.event_time >= now))
  );

  const myEvents = bookings?.filter(
    (booking) =>
      (booking.inviter_id === user?.user?.user_id ||
        booking.invitee_id === user?.user?.user_id) &&
      booking.booking_status_type_id === 5 &&
      (booking.event_type_id === 1 ||
        booking.event_type_id === 2 ||
        booking.event_type_id === 3)
  );

  const missingScores = scores?.filter(
    (score) =>
      (score.match_score_status_type_id === 1 &&
        myEvents?.find(
          (event) =>
            event.booking_id === score.booking_id && event.event_type_id === 2
        )) ||
      (score.match_score_status_type_id === 2 &&
        score.reporter_id !== user?.user?.user_id &&
        myEvents?.find(
          (event) =>
            event.booking_id === score.booking_id && event.event_type_id === 2
        ))
  );

  const myReviews = eventReviews?.filter(
    (review) =>
      review.is_active === true && review.reviewer_id === user?.user?.user_id
  );

  if (isBookingsLoading || isEventReviewsLoading) {
    return <PageLoading />;
  }
  return (
    <nav className={styles["header-player-container"]}>
      <div className={styles["header-nav-sub-container"]}>
        <NavLink
          to={paths.EXPLORE}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-player"]}`
              : `${styles["nav-link-player"]}`
          }
        >
          Keşfet
        </NavLink>
        <NavLink
          to={paths.TRAIN}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-player"]}`
              : `${styles["nav-link-player"]}`
          }
        >
          Antreman
        </NavLink>
        <NavLink
          to={paths.MATCH}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-player"]}`
              : `${styles["nav-link-player"]}`
          }
        >
          Maç
        </NavLink>
        <NavLink
          to={paths.LESSON}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-player"]}`
              : `${styles["nav-link-player"]}`
          }
        >
          Ders
        </NavLink>
      </div>
      <div className={styles["header-nav-sub-container"]}>
        <NavLink
          to={paths.CALENDAR}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-player"]}`
              : `${styles["nav-link-player"]}`
          }
        >
          Takvim
        </NavLink>
        <NavLink
          to={paths.REQUESTS}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-player"]}`
              : `${styles["nav-link-player"]}`
          }
        >
          Davetler
          {incomingBookings?.length > 0 && (
            <FaCircle className={styles["notification"]} />
          )}
        </NavLink>
        <NavLink
          to={paths.PERFORMANCE}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-player"]}`
              : `${styles["nav-link-player"]}`
          }
        >
          Performans
          {(myEvents?.length > myReviews?.length ||
            missingScores?.length > 0) && (
            <FaCircle className={styles["notification"]} />
          )}
        </NavLink>
      </div>
    </nav>
  );
};
export default PlayerHeader;
