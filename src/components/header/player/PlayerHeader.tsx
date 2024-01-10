import React, { useEffect } from "react";

import { FaCircle } from "react-icons/fa";

import { NavLink } from "react-router-dom";

import paths from "../../../routing/Paths";

import styles from "./styles.module.scss";

import PageLoading from "../../../components/loading/PageLoading";

import { useAppSelector } from "../../../store/hooks";
import { useGetBookingsByFilterQuery } from "../../../api/endpoints/BookingsApi";
import { useGetEventReviewsByFilterQuery } from "../../../api/endpoints/EventReviewsApi";
import { useGetMatchScoresQuery } from "../../../api/endpoints/MatchScoresApi";
import {
  currentDayLocale,
  currentTimeLocale,
} from "../../../common/util/TimeFunctions";

const PlayerHeader = ({ navigateUser, handleCloseProfileModal }) => {
  const user = useAppSelector((store) => store?.user?.user);

  const {
    data: bookings,
    isLoading: isBookingsLoading,
    refetch: refetchIncomingBookings,
  } = useGetBookingsByFilterQuery({
    booking_status_type_id: 1,
    booking_player_id: user?.user?.user_id,
  });

  const {
    data: myCompletedBookings,
    isLoading: isMyCompletedBookingsLoading,
    refetch: refetchMyCompletedBookings,
  } = useGetBookingsByFilterQuery({
    booking_status_type_id: 5,
    booking_player_id: user?.user?.user_id,
  });

  const {
    data: myReviews,
    isLoading: isEventReviewsLoading,
    refetch: refetchMyReviews,
  } = useGetEventReviewsByFilterQuery({
    is_active: true,
    reviewer_id: user?.user?.user_id,
  });

  const { data: scores, isLoading: isScoresLoading } = useGetMatchScoresQuery(
    {}
  );

  const incomingBookings = bookings?.filter(
    (booking) =>
      new Date(booking.event_date).toLocaleDateString() > currentDayLocale ||
      (new Date(booking.event_date).toLocaleDateString() === currentDayLocale &&
        booking.event_time >= currentTimeLocale &&
        booking.invitee_id === user?.user?.user_id)
  );

  const myEvents = myCompletedBookings?.filter(
    (booking) =>
      booking.event_type_id === 1 ||
      booking.event_type_id === 2 ||
      booking.event_type_id === 3
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

  useEffect(() => {
    refetchIncomingBookings();
    refetchMyCompletedBookings();
    refetchMyReviews();
  }, []);

  if (
    isBookingsLoading ||
    isEventReviewsLoading ||
    isScoresLoading ||
    isMyCompletedBookingsLoading
  ) {
    return <PageLoading />;
  }

  return (
    <nav
      className={styles["header-player-container"]}
      onClick={handleCloseProfileModal}
    >
      <div className={styles["header-nav-sub-container"]}>
        <NavLink
          to={paths.EXPLORE}
          onClick={() => navigateUser("EXPLORE")}
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
          onClick={() => navigateUser("TRAIN")}
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
          onClick={() => navigateUser("MATCH")}
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
          onClick={() => navigateUser("LESSON")}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-player"]}`
              : `${styles["nav-link-player"]}`
          }
        >
          Ders
        </NavLink>
        <NavLink
          to={paths.CALENDAR}
          onClick={() => navigateUser("CALENDAR")}
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
          onClick={() => navigateUser("REQUESTS")}
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
          onClick={() => navigateUser("PERFORMANCE")}
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
