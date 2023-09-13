import React from "react";

import Modal from "react-modal";

import { FaWindowClose } from "react-icons/fa";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";

import {
  useGetEventReviewsByFilterQuery,
  useGetEventReviewsQuery,
} from "../../../../api/endpoints/EventReviewsApi";

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

  const { data: selectedEventReview, isLoading: isSelectedEventReviewLoading } =
    useGetEventReviewsByFilterQuery({
      booking_id: selectedBookingId,
      reviewer_id_not_equal: user?.user?.user_id,
    });

  if (isSelectedEventReviewLoading) {
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
        <ReviewCard review={selectedEventReview?.[0]} />
      </div>
    </Modal>
  );
};

export default ViewEventReviewModal;
