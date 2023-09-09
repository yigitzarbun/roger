import React from "react";

import Modal from "react-modal";

import { FaWindowClose } from "react-icons/fa";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";

import { useGetEventReviewsQuery } from "../../../../api/endpoints/EventReviewsApi";

import PageLoading from "../../../../components/loading/PageLoading";
import ReviewCard from "../../../../components/common/reviews/ReviewCard";

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
        <ReviewCard review={selectedEventReview} />
      </div>
    </Modal>
  );
};

export default ViewEventReviewModal;
