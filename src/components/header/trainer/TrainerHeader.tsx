import React from "react";

import { FaCircle } from "react-icons/fa";

import { NavLink } from "react-router-dom";

import paths from "../../../routing/Paths";

import styles from "./styles.module.scss";

import PageLoading from "../../../components/loading/PageLoading";

import { useGetBookingsQuery } from "../../../api/endpoints/BookingsApi";
import { useAppSelector } from "../../../store/hooks";
import { useGetStudentsQuery } from "../../../api/endpoints/StudentsApi";
import { useGetEventReviewsQuery } from "../../../api/endpoints/EventReviewsApi";

const TrainerHeader = () => {
  const { data: bookings, isLoading: isBookingsLoading } = useGetBookingsQuery(
    {}
  );

  const { data: students, isLoading: isStudentsLoading } = useGetStudentsQuery(
    {}
  );

  const { data: eventReviews, isLoading: isEventReviewsLoading } =
    useGetEventReviewsQuery({});

  const user = useAppSelector((store) => store?.user?.user?.user);

  const date = new Date();
  const today = date.toLocaleDateString();
  const now = date.toLocaleTimeString();

  const incomingBookings = bookings?.filter(
    (booking) =>
      booking.invitee_id === user?.user_id &&
      booking.booking_status_type_id === 1 &&
      (new Date(booking.event_date).toLocaleDateString() > today ||
        (new Date(booking.event_date).toLocaleDateString() === today &&
          booking.event_time >= now))
  );

  const newStudentRequests = students?.filter(
    (student) =>
      student.trainer_id === user?.user_id &&
      student.student_status === "pending"
  );

  const myEvents = bookings?.filter(
    (booking) =>
      (booking.inviter_id === user?.user_id ||
        booking.invitee_id === user?.user_id) &&
      booking.booking_status_type_id === 5 &&
      booking.event_type_id === 3
  );

  const myReviews = eventReviews?.filter(
    (review) =>
      review.is_active === true && review.reviewer_id === user?.user_id
  );

  if (isBookingsLoading || isStudentsLoading || isEventReviewsLoading) {
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
