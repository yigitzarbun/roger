import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "./styles.module.scss";
import { useAppSelector } from "../../../../store/hooks";
import {
  useGetEventReviewsByFilterQuery,
  useGetEventReviewsQuery,
  useUpdateEventReviewMutation,
} from "../../../../../api/endpoints/EventReviewsApi";
import PageLoading from "../../../../components/loading/PageLoading";
import ReactModal from "react-modal";

interface AddEventReviewModalProps {
  isAddReviewModalOpen: boolean;
  closeReviewModal: () => void;
  selectedBookingId: number;
  fname: string;
  lname: string;
  image: string | null;
}

type FormValues = {
  event_review_title: string;
  event_review_description: string;
  review_score: number;
};

const AddEventReviewModal = (props: AddEventReviewModalProps) => {
  const {
    isAddReviewModalOpen,
    closeReviewModal,
    selectedBookingId,
    fname,
    lname,
    image,
  } = props;

  const { t } = useTranslation();

  const user = useAppSelector((store) => store?.user?.user);

  const [updateReview, { isSuccess: isUpdateReviewSuccess }] =
    useUpdateEventReviewMutation({});

  const { refetch: refetchReviews } = useGetEventReviewsQuery({});

  const { data: selectedEventReview, isLoading: isSelectedEventReviewLoading } =
    useGetEventReviewsByFilterQuery({
      reviewer_id: user?.user?.user_id,
      booking_id: selectedBookingId,
    });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (formData: FormValues) => {
    try {
      const reviewData = {
        event_review_id: selectedEventReview?.[0]?.event_review_id,
        event_review_title: formData?.event_review_title,
        event_review_description: formData?.event_review_description,
        review_score: Number(formData?.review_score),
        is_active: true,
        registered_at: new Date(),
        booking_id: selectedEventReview?.[0]?.booking_id,
        reviewer_id: selectedEventReview?.[0]?.reviewer_id,
        reviewee_id: selectedEventReview?.[0]?.reviewee_id,
      };
      updateReview(reviewData);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (isUpdateReviewSuccess) {
      reset();
      toast.success("Değerlendirme başarılı");
      refetchReviews();
      closeReviewModal();
    }
  }, [isUpdateReviewSuccess]);

  if (isSelectedEventReviewLoading) {
    return <PageLoading />;
  }

  return (
    <ReactModal
      isOpen={isAddReviewModalOpen}
      onRequestClose={closeReviewModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={closeReviewModal} />
      <div className={styles["modal-content"]}>
        <h3 className={styles.title}>{t("addReviewTitle")}</h3>
        <div className={styles["opponent-container"]}>
          <img src={image ? image : "/images/icons/avatar.jpg"} />
          <p>{`${fname} ${lname}`}</p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles["form-container"]}
        >
          <div className={styles["input-outer-container"]}>
            <div className={styles["title-input-container"]}>
              <label>{t("title")}</label>
              <input
                {...register("event_review_title", {
                  required: true,
                })}
                type="text"
              />
              {errors.event_review_title && (
                <span className={styles["error-field"]}>
                  {t("mandatoryField")}
                </span>
              )}
            </div>
            <div className={styles["input-container"]}>
              <label>{t("score")}</label>
              <input
                {...register("review_score", {
                  required: true,
                })}
                type="number"
                max={10}
                min={0}
              />
              {errors.review_score && (
                <span className={styles["error-field"]}>
                  {t("mandatoryField")}
                </span>
              )}
            </div>
          </div>
          <div className={styles["evaluation-container"]}>
            <label>{t("reviewText")}</label>
            <textarea
              {...register("event_review_description", {
                required: true,
              })}
            />
            {errors.event_review_description && (
              <span className={styles["error-field"]}>
                {t("mandatoryField")}
              </span>
            )}
          </div>
          <div className={styles["buttons-container"]}>
            <button
              onClick={closeReviewModal}
              className={styles["discard-button"]}
            >
              {t("declined")}
            </button>
            <button type="submit" className={styles["submit-button"]}>
              {t("submit")}
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
};

export default AddEventReviewModal;
