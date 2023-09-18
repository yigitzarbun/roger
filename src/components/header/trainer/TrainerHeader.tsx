import React, { useEffect } from "react";

import { FaCircle } from "react-icons/fa";

import { NavLink } from "react-router-dom";

import paths from "../../../routing/Paths";

import styles from "./styles.module.scss";

import PageLoading from "../../../components/loading/PageLoading";

import { useGetBookingsByFilterQuery } from "../../../api/endpoints/BookingsApi";
import { useAppSelector } from "../../../store/hooks";
import { useGetStudentsByFilterQuery } from "../../../api/endpoints/StudentsApi";
import { useGetEventReviewsByFilterQuery } from "../../../api/endpoints/EventReviewsApi";
import {
  currentDayLocale,
  currentTimeLocale,
} from "../../../common/util/TimeFunctions";

const TrainerHeader = () => {
  const user = useAppSelector((store) => store?.user?.user?.user);

  const {
    data: bookings,
    isLoading: isBookingsLoading,
    refetch: refetchBookings,
  } = useGetBookingsByFilterQuery({
    invitee_id: user?.user_id,
    booking_status_type_id: 1,
  });

  const {
    data: myReviews,
    isLoading: isEventReviewsLoading,
    refetch: refetchMyReviews,
  } = useGetEventReviewsByFilterQuery({
    is_active: true,
    reviewer_id: user?.user_id,
  });

  const incomingBookings = bookings?.filter(
    (booking) =>
      new Date(booking.event_date).toLocaleDateString() > currentDayLocale ||
      (new Date(booking.event_date).toLocaleDateString() === currentDayLocale &&
        booking.event_time >= currentTimeLocale)
  );

  const {
    data: newStudentRequests,
    isLoading: isNewStudentRequestsLoading,
    refetch: refetchStudentRequests,
  } = useGetStudentsByFilterQuery({
    trainer_id: user?.user_id,
    student_status: "pending",
  });

  const {
    data: myEvents,
    isLoading: isMyEventsLoading,
    refetch: refetchMyEvents,
  } = useGetBookingsByFilterQuery({
    booking_player_id: user?.user_id,
    booking_status_type_id: 5,
    event_type_id: 3,
  });

  useEffect(() => {
    refetchBookings();
    refetchMyReviews();
    refetchStudentRequests();
    refetchMyEvents();
  }, []);

  if (
    isBookingsLoading ||
    isNewStudentRequestsLoading ||
    isEventReviewsLoading ||
    isMyEventsLoading
  ) {
    return <PageLoading />;
  }

  return (
    <nav className={styles["header-trainer-container"]}>
      <div className={styles["header-nav-sub-container"]}>
        <NavLink
          to={paths.EXPLORE}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-trainer"]}`
              : `${styles["nav-link-trainer"]}`
          }
        >
          Keşfet
        </NavLink>
        <NavLink
          to={paths.CALENDAR}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-trainer"]}`
              : `${styles["nav-link-trainer"]}`
          }
        >
          Takvim
        </NavLink>
        <NavLink
          to={paths.REQUESTS}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-trainer"]}`
              : `${styles["nav-link-trainer"]}`
          }
        >
          Davetler{" "}
          {incomingBookings?.length > 0 && (
            <FaCircle className={styles["notification"]} />
          )}
        </NavLink>
        <NavLink
          to={paths.STUDENTS}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-trainer"]}`
              : `${styles["nav-link-trainer"]}`
          }
        >
          Öğrenciler{" "}
          {newStudentRequests.length > 0 && (
            <FaCircle className={styles["notification"]} />
          )}
        </NavLink>
        <NavLink
          to={paths.PERFORMANCE}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-trainer"]}`
              : `${styles["nav-link-trainer"]}`
          }
        >
          Performans{" "}
          {myEvents.length > myReviews.length && (
            <FaCircle className={styles["notification"]} />
          )}
        </NavLink>
      </div>
    </nav>
  );
};
export default TrainerHeader;
