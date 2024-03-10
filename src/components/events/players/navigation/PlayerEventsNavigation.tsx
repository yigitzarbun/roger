import React, { useEffect } from "react";

import styles from "./styles.module.scss";

import PageLoading from "../../../../components/loading/PageLoading";

import { useAppSelector } from "../../../../store/hooks";
import { useGetPlayerMissingEventReviewsNumberQuery } from "../../../../api/endpoints/EventReviewsApi";
import { useGetMissingMatchScoresNumberQuery } from "../../../../api/endpoints/MatchScoresApi";

interface PlayerEventsNavigationProps {
  display: string;
  isAddScoreModalOpen: boolean;
  isEditScoreModalOpen: boolean;
  isAddReviewModalOpen: boolean;
  handleDisplay: (value: string) => void;
}

const PlayerEventsNavigation = ({
  display,
  isAddScoreModalOpen,
  isEditScoreModalOpen,
  isAddReviewModalOpen,
  handleDisplay,
}: PlayerEventsNavigationProps) => {
  const user = useAppSelector((store) => store?.user?.user);

  const {
    data: missingScores,
    isLoading: isScoresLoading,
    refetch: refetchMissingScores,
  } = useGetMissingMatchScoresNumberQuery(user?.user?.user_id);

  const {
    data: missingReviews,
    isLoading: isReviewsLoading,
    refetch: refetchMissingReviews,
  } = useGetPlayerMissingEventReviewsNumberQuery(user?.user?.user_id);

  const missingScoresLength = missingScores?.length;

  useEffect(() => {
    refetchMissingScores();
    refetchMissingReviews();
  }, [isAddScoreModalOpen, isEditScoreModalOpen, isAddReviewModalOpen]);

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
        <span>Geçmiş Etkinlikler</span>
        <span className={styles.notification}>
          {missingReviews > 0 && `(${missingReviews})`}
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
          {missingScoresLength > 0 && `(${missingScoresLength})`}
        </span>
      </button>
    </div>
  );
};

export default PlayerEventsNavigation;
