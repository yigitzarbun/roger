import React, { useState } from "react";
import styles from "./styles.module.scss";
import ExploreTrainerReviewsModal from "../../modals/reviews/ExploreTrainerReviewsModal";
import ReviewCard from "../../../../../../components/common/reviews/ReviewCard";
import PageLoading from "../../../../../../components/loading/PageLoading";
import { useGetUserReceivedEventReviewsNumberQuery } from "../../../../../../../api/endpoints/EventReviewsApi";
import { useTranslation } from "react-i18next";

interface ExploreTrainersReviewsSectionProps {
  user_id: number;
}
const ExploreTrainersReviewsSection = (
  props: ExploreTrainersReviewsSectionProps
) => {
  const { user_id } = props;

  const { t } = useTranslation();

  const { data: eventReviews, isLoading: isEventReviewsLoading } =
    useGetUserReceivedEventReviewsNumberQuery(user_id);

  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);

  const openReviewsModal = () => {
    setIsReviewsModalOpen(true);
  };

  const closeReviewsModal = () => {
    setIsReviewsModalOpen(false);
  };

  if (isEventReviewsLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["reviews-section"]}>
      <h2>{t("reviewsTitle")}</h2>
      <div className={styles["reviews-container"]}>
        {eventReviews?.length > 0 ? (
          eventReviews?.slice(eventReviews?.length - 2)?.map((review) => (
            <div
              className={styles["review-container-wrapper"]}
              key={review.event_review_id}
            >
              <ReviewCard review={review} />
            </div>
          ))
        ) : (
          <p>{t("noReviewsText")}</p>
        )}
      </div>
      {eventReviews?.length > 0 && (
        <button onClick={openReviewsModal}>
          {" "}
          {t("leaderBoardViewAllButtonText")}
        </button>
      )}

      <ExploreTrainerReviewsModal
        isReviewsModalOpen={isReviewsModalOpen}
        closeReviewsModal={closeReviewsModal}
        trainerReviewsReceived={eventReviews}
      />
    </div>
  );
};

export default ExploreTrainersReviewsSection;
