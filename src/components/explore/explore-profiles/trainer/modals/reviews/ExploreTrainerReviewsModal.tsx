import React from "react";

import ReactModal from "react-modal";

import styles from "./styles.module.scss";
import ReviewCard from "../../../../../../components/common/reviews/ReviewCard";

import { EventReview } from "../../../../../../api/endpoints/EventReviewsApi";

interface ExploreTrainerReviewsModalProps {
  isReviewsModalOpen: boolean;
  closeReviewsModal: () => void;
  trainerReviewsReceived: EventReview[];
}

const ExploreTrainerReviewsModal = (props: ExploreTrainerReviewsModalProps) => {
  const { isReviewsModalOpen, closeReviewsModal, trainerReviewsReceived } =
    props;

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
          <h1>Değerlendirmeler</h1>
        </div>
        <div className={styles["reviews-container"]}>
          {trainerReviewsReceived?.length > 0 ? (
            trainerReviewsReceived?.map((review) => (
              <div
                className={styles["review-container-wrapper"]}
                key={review.event_review_id}
              >
                <ReviewCard review={review} />
              </div>
            ))
          ) : (
            <p>Henüz eğitmen hakkında değerlendirme yapılmamıştır.</p>
          )}
        </div>
      </div>
    </ReactModal>
  );
};

export default ExploreTrainerReviewsModal;
