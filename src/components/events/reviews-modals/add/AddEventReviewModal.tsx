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

interface AddEventReviewModalProps {
  isAddReviewModalOpen: boolean;
  closeReviewModal: () => void;
  selectedBookingId: number;
}

type FormValues = {
  event_review_title: string;
  event_review_description: string;
  review_score: number;
  booking_id: number;
};

const AddEventReviewModal = (props: AddEventReviewModalProps) => {
  const { isAddReviewModalOpen, closeReviewModal, selectedBookingId } = props;
  const user = useAppSelector((store) => store?.user?.user);

  const [addReview, { isSuccess: isAddReviewSuccess }] =
    useAddEventReviewMutation({});

  const { refetch: refetchReviews } = useGetEventReviewsQuery({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (formData: FormValues) => {
    try {
      const reviewData = {
        event_review_title: formData?.event_review_title,
        event_review_description: formData?.event_review_description,
        review_score: Number(formData?.review_score),
        booking_id: Number(selectedBookingId),
        reviewer_id: user?.user?.user_id,
      };
      addReview(reviewData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isAddReviewSuccess) {
      reset();
      refetchReviews();
      closeReviewModal();
    }
  }, [isAddReviewSuccess]);

  return (
    <Modal
      isOpen={isAddReviewModalOpen}
      onRequestClose={closeReviewModal}
      className={styles["modal-container"]}
    >
      <div className={styles["top-container"]}>
        <h1 className={styles.title}>Değerlendirme Ekle</h1>
        <FaWindowClose
          onClick={closeReviewModal}
          className={styles["close-icon"]}
        />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles["form-container"]}
      >
        <div className={styles["input-outer-container"]}>
          <div className={styles["input-container"]}>
            <label>Başlık</label>
            <input
              {...register("event_review_title", {
                required: true,
              })}
              type="text"
            />
            {errors.event_review_title && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
          <div className={styles["input-container"]}>
            <label>Puan (0 = Çok Kötü -- 10 = Çok iyi)</label>
            <input
              {...register("review_score", {
                required: true,
              })}
              type="number"
              max={10}
              min={0}
            />
            {errors.review_score && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
        </div>
        <div className={styles["evaluation-container"]}>
          <label>Değerlendirme</label>
          <textarea
            {...register("event_review_description", {
              required: true,
            })}
          />
          {errors.event_review_description && (
            <span className={styles["error-field"]}>Bu alan zorunludur.</span>
          )}
        </div>

        <button type="submit" className={styles["form-button"]}>
          Onayla
        </button>
      </form>
    </Modal>
  );
};

export default AddEventReviewModal;
