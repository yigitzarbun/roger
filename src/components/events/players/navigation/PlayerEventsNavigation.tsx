import React from "react";

import styles from "./styles.module.scss";

import PageLoading from "../../../../components/loading/PageLoading";

import { useAppSelector } from "../../../../store/hooks";
import { useGetPlayerMissingEventReviewsNumberQuery } from "../../../../api/endpoints/EventReviewsApi";
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
