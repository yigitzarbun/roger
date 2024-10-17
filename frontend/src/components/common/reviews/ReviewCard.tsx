import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { imageUrl } from "../../../common/constants/apiConstants";
import paths from "../../../routing/Paths";
import styles from "./styles.module.scss";

const ReviewCard = ({ review }) => {
  const { t } = useTranslation();

  return (
    <div className={styles["review-container"]} key={review.event_review_id}>
      <div className={styles["title-container"]}>
        <h4>{review.event_review_title}</h4>
        <p>{review.registered_at?.slice(0, 10)}</p>
      </div>
      <p className={styles.description}>{review.event_review_description}</p>
      <div className={styles["score-type-container"]}>
        <p>
          <span className={styles.subtitle}>{t("tableScoreHeader")}:</span>{" "}
          <span
            className={styles["score-text"]}
          >{`${review.review_score}/10`}</span>
        </p>
        <p>
          <span className={styles.subtitle}>{t("tableClubTypeHeader")}:</span>{" "}
          {`${
            review?.event_type_id === 1
              ? t("training")
              : review?.event_type_id === 2
              ? t("match")
              : review?.event_type_id === 3
              ? t("lesson")
              : review?.event_type_id === 4
              ? t("externalTraining")
              : review?.event_type_id === 5
              ? t("externalLesson")
              : review?.event_type_id === 6
              ? t("groupLesson")
              : review?.event_type_id === 7
              ? t("tournamentMatch")
              : ""
          }`}
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
                review?.user_type_id === 1 && review?.playerImage
                  ? `${imageUrl}/${review?.playerImage}`
                  : review?.user_type_id === 2 && review?.image
                  ? `${imageUrl}/${review?.image}`
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
              ? `${review?.playerFname} ${review?.playerLname}`
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
