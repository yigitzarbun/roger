import React from "react";

import ReactModal from "react-modal";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../../../../routing/Paths";

import { localUrl } from "../../../../../../common/constants/apiConstants";

import PageLoading from "../../../../../loading/PageLoading";

import { EventReview } from "../../../../../../api/endpoints/EventReviewsApi";
import { Booking } from "../../../../../../api/endpoints/BookingsApi";
import { Player } from "../../../../../../api/endpoints/PlayersApi";
import { Trainer } from "../../../../../../api/endpoints/TrainersApi";
import { useGetUsersQuery } from "../../../../../../store/auth/apiSlice";

interface ExplorePlayerReviewsModalProps {
  isReviewsModalOpen: boolean;
  closeReviewsModal: () => void;
  playerReviewsReceived: EventReview[];
  bookings: Booking[];
  players: Player[];
  trainers: Trainer[];
}

const ExplorePlayerReviewsModal = (props: ExplorePlayerReviewsModalProps) => {
  const {
    isReviewsModalOpen,
    closeReviewsModal,
    playerReviewsReceived,
    bookings,
    players,
    trainers,
  } = props;

  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery({});

  if (isUsersLoading) {
    return <PageLoading />;
  }
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
            <div
              className={styles["review-container"]}
              key={review.event_review_id}
            >
              <h4>{review.event_review_title}</h4>
              <p>{review.event_review_description}</p>
              <p>{`${review.review_score}/10`}</p>
              {bookings?.find(
                (booking) =>
                  booking.booking_id === review.booking_id &&
                  (booking.event_type_id === 1 ||
                    booking.event_type_id === 2 ||
                    booking.event_type_id === 3)
              ) && (
                <div className={styles["reviewer-container"]}>
                  <Link
                    to={
                      users?.find((user) => user.user_id === review.reviewer_id)
                        ?.user_type_id === 1
                        ? `${paths.EXPLORE_PROFILE}1/${review.reviewer_id} `
                        : users?.find(
                            (user) => user.user_id === review.reviewer_id
                          )?.user_type_id === 2
                        ? `${paths.EXPLORE_PROFILE}2/${review.reviewer_id} `
                        : ""
                    }
                    onClick={closeReviewsModal}
                  >
                    <img
                      src={
                        users?.find(
                          (user) => user.user_id === review.reviewer_id
                        )?.user_type_id === 1 &&
                        players?.find(
                          (player) => player.user_id === review.reviewer_id
                        )?.image
                          ? `${localUrl}/${
                              players.find(
                                (player) =>
                                  player.user_id === review.reviewer_id
                              )?.image
                            }`
                          : users?.find(
                              (user) => user.user_id === review.reviewer_id
                            )?.user_type_id === 2 &&
                            trainers?.find(
                              (trainer) =>
                                trainer.user_id === review.reviewer_id
                            )?.image
                          ? `${localUrl}/${
                              trainers.find(
                                (trainer) =>
                                  trainer.user_id === review.reviewer_id
                              )?.image
                            }`
                          : "/images/icons/avatar.png"
                      }
                      className={styles["reviewer-image"]}
                    />
                  </Link>
                  <Link
                    to={
                      users?.find((user) => user.user_id === review.reviewer_id)
                        ?.user_type_id === 1
                        ? `${paths.EXPLORE_PROFILE}1/${review.reviewer_id} `
                        : users?.find(
                            (user) => user.user_id === review.reviewer_id
                          )?.user_type_id === 2
                        ? `${paths.EXPLORE_PROFILE}2/${review.reviewer_id} `
                        : ""
                    }
                    className={styles["reviewer-name"]}
                    onClick={closeReviewsModal}
                  >
                    {users?.find((user) => user.user_id === review.reviewer_id)
                      ?.user_type_id === 1
                      ? `${
                          players?.find(
                            (player) => player.user_id === review.reviewer_id
                          )?.fname
                        } ${
                          players.find(
                            (player) => player.user_id === review.reviewer_id
                          )?.lname
                        }`
                      : users?.find(
                          (user) => user.user_id === review.reviewer_id
                        )?.user_type_id === 2
                      ? `${
                          trainers?.find(
                            (trainer) => trainer.user_id === review.reviewer_id
                          )?.fname
                        } ${
                          trainers.find(
                            (trainer) => trainer.user_id === review.reviewer_id
                          )?.lname
                        }`
                      : ""}
                  </Link>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>Henüz oyuncu hakkında değerlendirme yapılmamıştır.</p>
        )}
      </div>
    </ReactModal>
  );
};
export default ExplorePlayerReviewsModal;
