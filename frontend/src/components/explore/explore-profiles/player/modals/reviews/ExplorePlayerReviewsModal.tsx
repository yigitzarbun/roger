import React from "react";
import ReactModal from "react-modal";
import styles from "./styles.module.scss";
import ReviewCard from "../../../../../../components/common/reviews/ReviewCard";
import { EventReview } from "../../../../../../../api/endpoints/EventReviewsApi";
import { useTranslation } from "react-i18next";

interface ExplorePlayerReviewsModalProps {
  isReviewsModalOpen: boolean;
  closeReviewsModal: () => void;
  playerReviewsReceived: EventReview[];
}

const ExplorePlayerReviewsModal = (props: ExplorePlayerReviewsModalProps) => {
  const { isReviewsModalOpen, closeReviewsModal, playerReviewsReceived } =
    props;

  const { t } = useTranslation();

  return (
    <ReactModal
      isOpen={isReviewsModalOpen}
      onRequestClose={closeReviewsModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={closeReviewsModal} />
      <div className={styles["modal-content"]}>
        <div className={styles["top-container"]}>
          <h1>{t("reviewsTitle")}</h1>
        </div>
        <div className={styles["reviews-container"]}>
          {playerReviewsReceived?.length > 0 ? (
            playerReviewsReceived?.map((review) => (
              <ReviewCard key={review.event_review_id} review={review} />
            ))
          ) : (
            <p>{t("noReviewsText")}</p>
          )}
        </div>
      </div>
    </ReactModal>
  );
};
export default ExplorePlayerReviewsModal;
