import React from "react";

import ReactModal from "react-modal";

import styles from "./styles.module.scss";

import ReviewCard from "../../../../../../components/common/reviews/ReviewCard";

import { EventReview } from "../../../../../../api/endpoints/EventReviewsApi";

interface ExplorePlayerReviewsModalProps {
  isReviewsModalOpen: boolean;
  closeReviewsModal: () => void;
  playerReviewsReceived: EventReview[];
}

const ExplorePlayerReviewsModal = (props: ExplorePlayerReviewsModalProps) => {
  const { isReviewsModalOpen, closeReviewsModal, playerReviewsReceived } =
    props;

  return (
    <ReactModal
      isOpen={isReviewsModalOpen}
      onRequestClose={closeReviewsModal}
      className={styles["modal-container"]}
    >
      <div className={styles["top-container"]}>
        <h1>Geçmiş Etkinlikler</h1>
        <img
          src="/images/icons/close.png"
          onClick={closeReviewsModal}
          className={styles["close-button"]}
        />
      </div>
      <div className={styles["reviews-container"]}>
        {playerReviewsReceived?.length > 0 ? (
          playerReviewsReceived?.map((review) => (
            <ReviewCard key={review.event_review_id} review={review} />
          ))
        ) : (
          <p>Henüz oyuncu hakkında değerlendirme yapılmamıştır.</p>
        )}
      </div>
    </ReactModal>
  );
};
export default ExplorePlayerReviewsModal;
