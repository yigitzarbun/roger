import React from "react";

import Modal from "react-modal";

import { FaWindowClose } from "react-icons/fa";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";

import { useGetEventReviewsQuery } from "../../../../api/endpoints/EventReviewsApi";

import PageLoading from "../../../../components/loading/PageLoading";

interface ViewEventReviewModalProps {
  isViewReviewModalOpen: boolean;
  closeViewReviewModal: () => void;
  selectedBookingId: number;
}

const ViewEventReviewModal = (props: ViewEventReviewModalProps) => {
  const { isViewReviewModalOpen, closeViewReviewModal, selectedBookingId } =
    props;

  const user = useAppSelector((store) => store?.user?.user);

  const { data: eventReviews, isLoading: isEventReviewsLoading } =
    useGetEventReviewsQuery({});

  const selectedEventReview = eventReviews?.find(
    (review) =>
      review.booking_id === selectedBookingId &&
      review.reviewer_id !== user?.user?.user_id
  );

  if (isEventReviewsLoading) {
    return <PageLoading />;
  }

  return (
    <Modal
      isOpen={isViewReviewModalOpen}
      onRequestClose={closeViewReviewModal}
      className={styles["modal-container"]}
    >
      <div className={styles["top-container"]}>
        <h1 className={styles.title}>Değerlendirme Görüntüle</h1>
        <FaWindowClose
          onClick={closeViewReviewModal}
          className={styles["close-icon"]}
        />
      </div>
      <div>
        <h2>{selectedEventReview?.event_review_title}</h2>
        <p>{selectedEventReview?.event_review_description}</p>
        <p>{`${selectedEventReview?.review_score}/10`}</p>
      </div>
    </Modal>
  );
};

export default ViewEventReviewModal;
