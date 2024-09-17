import React from "react";

import styles from "./styles.module.scss";

import PageLoading from "../../../../components/loading/PageLoading";

import { useGetTrainerProfileDetailsQuery } from "../../../../../api/endpoints/TrainersApi";

import { useGetStudentGroupsByFilterQuery } from "../../../../../api/endpoints/StudentGroupsApi";

import ExploreTrainersInteractionSection from "./sections/interaction/ExploreTrainersInteractionSection";
import ExploreTrainersReviewsSection from "./sections/reviews/ExploreTrainersReviewsSection";
import ExploreTrainersEventsSection from "./sections/events/ExploreTrainersEventsSection";

interface ExploreTrainerProfileProps {
  user_id: string;
}
const ExploreTrainerProfile = (props: ExploreTrainerProfileProps) => {
  const { user_id } = props;

  const { data: selectedTrainer, isLoading: isSelectedTrainerLoading } =
    useGetTrainerProfileDetailsQuery(Number(user_id));

  const { data: trainerGroups, isLoading: isTrainerGroupsLoading } =
    useGetStudentGroupsByFilterQuery({
      is_active: true,
      trainer_id: Number(user_id),
    });

  if (isTrainerGroupsLoading || isSelectedTrainerLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles.profile}>
      <div className={styles["top-sections-container"]}>
        <ExploreTrainersInteractionSection
          user_id={Number(user_id)}
          selectedTrainer={selectedTrainer}
        />
      </div>
      <div>
        <ExploreTrainersReviewsSection user_id={Number(user_id)} />
      </div>
      <div>
        <ExploreTrainersEventsSection
          selectedTrainer={selectedTrainer}
          trainerGroups={trainerGroups}
        />
      </div>
    </div>
  );
};
export default ExploreTrainerProfile;
