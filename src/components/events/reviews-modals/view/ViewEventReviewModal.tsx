import React from "react";

import Modal from "react-modal";

import { FaWindowClose } from "react-icons/fa";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";

import {
  useGetEventReviewsByFilterQuery,
  useGetReviewDetailsByFilterQuery,
} from "../../../../api/endpoints/EventReviewsApi";

import PageLoading from "../../../../components/loading/PageLoading";
import ReviewCard from "../../../../components/common/reviews/ReviewCard";
import ReactModal from "react-modal";

interface ViewEventReviewModalProps {
  isViewReviewModalOpen: boolean;
  closeViewReviewModal: () => void;
  selectedBookingId: number;
}

const ViewEventReviewModal = (props: ViewEventReviewModalProps) => {
  const { isViewReviewModalOpen, closeViewReviewModal, selectedBookingId } =
    props;

  const user = useAppSelector((store) => store?.user?.user);

  const { data: selectedEventReview, isLoading: isSelectedEventReviewLoading } =
    useGetReviewDetailsByFilterQuery({
      userId: user?.user?.user_id,
      bookingId: selectedBookingId,
    });
  console.log(selectedBookingId);
  console.log(selectedEventReview);
  if (isSelectedEventReviewLoading) {
    return <PageLoading />;
  }

  return (
    <ReactModal
      isOpen={isViewReviewModalOpen}
      onRequestClose={closeViewReviewModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={closeViewReviewModal} />
      <div className={styles["modal-content"]}>
        <h3 className={styles.title}>Değerlendirme</h3>
        <ReviewCard review={selectedEventReview?.[0]} />
      </div>
    </ReactModal>
  );
};

export default ViewEventReviewModal;
