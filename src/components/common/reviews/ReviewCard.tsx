import React from "react";

import { Link } from "react-router-dom";
import { localUrl } from "../../../common/constants/apiConstants";
import paths from "../../../routing/Paths";

import styles from "./styles.module.scss";

import PageLoading from "../../../components/loading/PageLoading";

import { useGetUsersQuery } from "../../../store/auth/apiSlice";
import { useGetPlayersQuery } from "../../../api/endpoints/PlayersApi";
import { useGetTrainersQuery } from "../../../api/endpoints/TrainersApi";
import { useGetBookingsQuery } from "../../../api/endpoints/BookingsApi";
import { useGetEventTypesQuery } from "../../../api/endpoints/EventTypesApi";

const ReviewCard = ({ review }) => {
  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery({});
  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});
  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );
  const { data: bookings, isLoading: isBookingsLoading } = useGetBookingsQuery(
    {}
  );
  const { data: eventTypes, isLoading: isEventTypesLoading } =
    useGetEventTypesQuery({});

  const selectedPlayer = (user_id: number) => {
    return players?.find((player) => player.user_id === user_id);
  };

  const selectedTrainer = (user_id: number) => {
    return trainers?.find((trainer) => trainer.user_id === user_id);
  };

  if (
    isUsersLoading ||
    isPlayersLoading ||
    isTrainersLoading ||
    isBookingsLoading ||
    isEventTypesLoading
  ) {
    return <PageLoading />;
  }

  return (
    <div className={styles["review-container"]} key={review.event_review_id}>
      <div className={styles["title-container"]}>
        <h4>{review.event_review_title}</h4>
        <p>{review.registered_at?.slice(0, 10)}</p>
      </div>
      <p>{review.event_review_description}</p>
      <div className={styles["score-type-container"]}>
        <p>
          <span className={styles.subtitle}>Skor:</span>{" "}
          <span
            className={styles["score-text"]}
          >{`${review.review_score}/10`}</span>
        </p>
        <p>
          <span className={styles.subtitle}>Tür :</span>{" "}
          {`${
            eventTypes.find(
              (type) =>
                type.event_type_id ===
                bookings.find(
                  (booking) => booking.booking_id === review.booking_id
                )?.event_type_id
            )?.event_type_name
          }`}
        </p>
      </div>
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
                : users?.find((user) => user.user_id === review.reviewer_id)
                    ?.user_type_id === 2
                ? `${paths.EXPLORE_PROFILE}2/${review.reviewer_id} `
                : ""
            }
          >
            <img
              src={
                users?.find((user) => user.user_id === review.reviewer_id)
                  ?.user_type_id === 1 &&
                selectedPlayer(review.reviewer_id)?.image
                  ? `${localUrl}/${selectedPlayer(review.reviewer_id)?.image}`
                  : users?.find((user) => user.user_id === review.reviewer_id)
                      ?.user_type_id === 2 &&
                    selectedTrainer(review.reviewer_id)?.image
                  ? `${localUrl}/${selectedTrainer(review.reviewer_id)?.image}`
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
                : users?.find((user) => user.user_id === review.reviewer_id)
                    ?.user_type_id === 2
                ? `${paths.EXPLORE_PROFILE}2/${review.reviewer_id} `
                : ""
            }
            className={styles["reviewer-name"]}
          >
            {users?.find((user) => user.user_id === review.reviewer_id)
              ?.user_type_id === 1
              ? `${selectedPlayer(review.reviewer_id)?.fname} ${
                  selectedPlayer(review.reviewer_id)?.lname
                }`
              : users?.find((user) => user.user_id === review.reviewer_id)
                  ?.user_type_id === 2
              ? `${selectedTrainer(review.reviewer_id)?.fname} ${
                  selectedTrainer(review.reviewer_id)?.lname
                }`
              : ""}
          </Link>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
