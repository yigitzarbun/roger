import React, { useState } from "react";

import styles from "./styles.module.scss";

import ExploreTrainerReviewsModal from "../../modals/reviews/ExploreTrainerReviewsModal";
import ReviewCard from "../../../../../../components/common/reviews/ReviewCard";
import PageLoading from "../../../../../../components/loading/PageLoading";

import { useGetEventReviewsByFilterQuery } from "../../../../../../api/endpoints/EventReviewsApi";
import { Booking } from "../../../../../../api/endpoints/BookingsApi";
import { Player } from "../../../../../../api/endpoints/PlayersApi";

interface ExploreTrainersReviewsSectionProps {
  user_id: number;
  trainerBookings: Booking[];
  players: Player[];
}
const ExploreTrainersReviewsSection = (
  props: ExploreTrainersReviewsSectionProps
) => {
  const { user_id, trainerBookings, players } = props;

  const { data: eventReviews, isLoading: isReviewsLoading } =
    useGetEventReviewsByFilterQuery({
      reviewer_id_not_equal: Number(user_id),
    });

  const trainerReviewsReceived = eventReviews?.filter(
    (review) =>
      review.booking_id ===
      trainerBookings?.find(
        (booking) => booking.booking_id === review.booking_id
      )?.booking_id
  );

  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);

  const openReviewsModal = () => {
    setIsReviewsModalOpen(true);
  };

  const closeReviewsModal = () => {
    setIsReviewsModalOpen(false);
  };

  if (isReviewsLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["reviews-section"]}>
      <h2>Eğitmen Hakkında Değerlendirmeler</h2>
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
      <button onClick={openReviewsModal}>Tümünü Görüntüle</button>
      <ExploreTrainerReviewsModal
        isReviewsModalOpen={isReviewsModalOpen}
        closeReviewsModal={closeReviewsModal}
        trainerReviewsReceived={trainerReviewsReceived}
        bookings={trainerBookings}
        players={players}
      />
    </div>
  );
};

export default ExploreTrainersReviewsSection;
