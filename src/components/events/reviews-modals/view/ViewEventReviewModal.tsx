import React, { useEffect } from "react";

import Modal from "react-modal";

import { FaWindowClose } from "react-icons/fa";

import { useForm, SubmitHandler } from "react-hook-form";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";

import {
  useAddEventReviewMutation,
  useGetEventReviewsQuery,
} from "../../../../api/endpoints/EventReviewsApi";
import { useGetBookingsQuery } from "../../../../api/endpoints/BookingsApi";

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

  const { data: bookings, isLoading: isBookingsLoading } = useGetBookingsQuery(
    {}
  );

  const selectedEventReview = eventReviews?.find(
    (review) =>
      review.booking_id === selectedBookingId &&
      review.reviewer_id !== user?.user?.user_id
  );

  if (isEventReviewsLoading || isBookingsLoading) {
    return <div>Yükleniyor..</div>;
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
