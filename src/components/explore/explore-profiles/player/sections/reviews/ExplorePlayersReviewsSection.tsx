import React, { useState } from "react";

import styles from "./styles.module.scss";

import ExplorePlayerReviewsModal from "../../modals/reviews/ExplorePlayerReviewsModal";
import ReviewCard from "../../../../../../components/common/reviews/ReviewCard";

import { useGetEventReviewsByFilterQuery } from "../../../../../../api/endpoints/EventReviewsApi";
import { Player } from "../../../../../../api/endpoints/PlayersApi";
import { Booking } from "../../../../../../api/endpoints/BookingsApi";
import PageLoading from "../../../../../../components/loading/PageLoading";

interface ExplorePlayersReviewsSectionProps {
  selectedPlayer: Player;
  playerBookings: Booking[];
}
const ExplorePlayersReviewsSection = (
  props: ExplorePlayersReviewsSectionProps
) => {
  const { selectedPlayer, playerBookings } = props;

  const { data: eventReviews, isLoading: isEventReviewsLoading } =
    useGetEventReviewsByFilterQuery({
      reviewer_id_not_equal: selectedPlayer?.[0]?.user_id,
    });

  const playerReviewsReceived = eventReviews?.filter(
    (review) =>
      review.booking_id ===
      playerBookings?.find(
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

  if (isEventReviewsLoading) {
    return <PageLoading />;
  }
  return (
    <div className={styles["reviews-section"]}>
      <h2>Değerlendirmeler</h2>
      <div className={styles["reviews-container"]}>
        {playerReviewsReceived?.length > 0 ? (
          playerReviewsReceived
            ?.slice(playerReviewsReceived.length - 2)
            ?.map((review) => (
              <div
                className={styles["review-container-wrapper"]}
                key={review.event_review_id}
              >
                <ReviewCard review={review} />
              </div>
            ))
        ) : (
          <p>Henüz oyuncu hakkında değerlendirme yapılmamıştır.</p>
        )}
      </div>
      <button onClick={openReviewsModal}>Tümünü Görüntüle</button>
      <ExplorePlayerReviewsModal
        isReviewsModalOpen={isReviewsModalOpen}
        closeReviewsModal={closeReviewsModal}
        playerReviewsReceived={playerReviewsReceived}
      />
    </div>
  );
};

export default ExplorePlayersReviewsSection;
