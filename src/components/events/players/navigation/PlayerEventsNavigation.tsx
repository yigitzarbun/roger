import React from "react";

import styles from "./styles.module.scss";

import PageLoading from "../../../../components/loading/PageLoading";

import { useAppSelector } from "../../../../store/hooks";
import { useGetBookingsByFilterQuery } from "../../../../api/endpoints/BookingsApi";
import {
  useGetEventReviewsByFilterQuery,
  useGetPlayerMissingEventReviewsNumberQuery,
} from "../../../../api/endpoints/EventReviewsApi";
import { useGetMissingMatchScoresNumberQuery } from "../../../../api/endpoints/MatchScoresApi";

interface PlayerEventsNavigationProps {
  display: string;
  handleDisplay: (value: string) => void;
}

const PlayerEventsNavigation = ({
  display,
  handleDisplay,
}: PlayerEventsNavigationProps) => {
  const user = useAppSelector((store) => store?.user?.user);

  const { data: missingScores, isLoading: isScoresLoading } =
    useGetMissingMatchScoresNumberQuery(user?.user?.user_id);

  const { data: missingReviews, isLoading: isReviewsLoading } =
    useGetPlayerMissingEventReviewsNumberQuery(user?.user?.user_id);

  /*
  const { data: bookings, isLoading: isBookingsLoading } =
    useGetBookingsByFilterQuery({
      booking_player_id: user?.user?.user_id,
      booking_status_type_id: 5,
    });


  const myEvents = bookings?.filter(
    (booking) =>
      booking.event_type_id === 1 ||
      booking.event_type_id === 2 ||
      booking.event_type_id === 3
  );

  
  const { data: myReviews, isLoading: isMyReviewsLoading } =
    useGetEventReviewsByFilterQuery({
      is_active: true,
      reviewer_id: user?.user?.user_id,
    });
   
  

  const myEventsLength = myEvents?.length;
  const myReviewsLength = myReviews?.length;
  const missingEventReviews = myEventsLength - myReviewsLength
   */
  const missingScoresLength = missingScores?.length;

  if (isScoresLoading || isReviewsLoading) {
    return <PageLoading />;
  }

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
          {missingReviews > 0 && missingReviews}
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
          {missingScoresLength > 0 && missingScoresLength}
        </span>
      </button>
    </div>
  );
};

export default PlayerEventsNavigation;
