import React from "react";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";
import { useGetBookingsQuery } from "../../../../api/endpoints/BookingsApi";
import { useGetEventReviewsQuery } from "../../../../api/endpoints/EventReviewsApi";
import { useGetMatchScoresQuery } from "../../../../api/endpoints/MatchScoresApi";

interface PlayerEventsNavigationProps {
  display: string;
  handleDisplay: (value: string) => void;
}

const PlayerEventsNavigation = ({
  display,
  handleDisplay,
}: PlayerEventsNavigationProps) => {
  const user = useAppSelector((store) => store?.user?.user);

  const { data: bookings, isLoading: isBookingsLoading } = useGetBookingsQuery(
    {}
  );
  const { data: eventReviews, isLoading: isEventReviewsLoading } =
    useGetEventReviewsQuery({});

  const { data: scores, isLoading: isScoresLoading } = useGetMatchScoresQuery(
    {}
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

  return (
    <div className={styles["nav-container"]}>
      <button
        onClick={() => handleDisplay("events")}
        className={
          display === "events"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        Geçmiş Etkinlikler
        <span className={styles.notification}>
          {myEvents?.length > myReviews?.length &&
            myEvents?.length - myReviews?.length}
        </span>
      </button>
      <button
        onClick={() => handleDisplay("scores")}
        className={
          display === "scores"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        Skorlar{" "}
        <span className={styles.notification}>
          {missingScores?.length > 0 && missingScores?.length}
        </span>
      </button>
    </div>
  );
};

export default PlayerEventsNavigation;
