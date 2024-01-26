import React from "react";

import { Link } from "react-router-dom";
import { localUrl } from "../../../common/constants/apiConstants";
import paths from "../../../routing/Paths";

import styles from "./styles.module.scss";

const ReviewCard = ({ review }) => {
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
          {`${review?.event_type_name}`}
        </p>
      </div>
      {(review.event_type_id === 1 ||
        review.event_type_id === 2 ||
        review.event_type_id === 3) && (
        <div className={styles["reviewer-container"]}>
          <Link
            to={
              review.user_type_id === 1
                ? `${paths.EXPLORE_PROFILE}1/${review.reviewer_id} `
                : review?.user_type_id === 2
                ? `${paths.EXPLORE_PROFILE}2/${review.reviewer_id} `
                : ""
            }
          >
            <img
              src={
                review?.user_type_id === 1 && review?.image
                  ? `${localUrl}/${review?.image}`
                  : review?.user_type_id === 2 && review?.image
                  ? `${localUrl}/${review?.image}`
                  : "/images/icons/avatar.jpg"
              }
              className={styles["reviewer-image"]}
            />
          </Link>
          <Link
            to={
              review?.user_type_id === 1
                ? `${paths.EXPLORE_PROFILE}1/${review.reviewer_id} `
                : review?.user_type_id === 2
                ? `${paths.EXPLORE_PROFILE}2/${review.reviewer_id} `
                : ""
            }
            className={styles["reviewer-name"]}
          >
            {review?.user_type_id === 1
              ? `${review?.fname} ${review?.lname}`
              : review?.user_type_id === 2
              ? `${review?.fname} ${review?.lname}`
              : ""}
          </Link>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
