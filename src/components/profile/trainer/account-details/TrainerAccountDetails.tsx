import React from "react";

import styles from "./styles.module.scss";

import TrainerImage from "./trainer-image/TrainerImage";
import TrainerName from "./trainer-name/TrainerName";
import TrainerAge from "./trainer-age/TrainerAge";
import TrainerLocation from "./trainer-location/TrainerLocation";
import TrainerGender from "./trainer-gender/TrainerGender";
import TrainerExperience from "./trainer-experience/TrainerExperience";

interface TrainerAccountDetailsProps {
  trainerDetails: any;
  refetchTrainerDetails: () => void;
}
const TrainerAccountDetails = (props: TrainerAccountDetailsProps) => {
  const { trainerDetails, refetchTrainerDetails } = props;

  return (
    <div className={styles["trainer-account-details"]}>
      <TrainerImage
        trainerDetails={trainerDetails}
        refetchTrainerDetails={refetchTrainerDetails}
      />
      <TrainerName
        trainerDetails={trainerDetails}
        refetchTrainerDetails={refetchTrainerDetails}
      />
      <TrainerAge
        trainerDetails={trainerDetails}
        refetchTrainerDetails={refetchTrainerDetails}
      />
      <TrainerLocation
        trainerDetails={trainerDetails}
        refetchTrainerDetails={refetchTrainerDetails}
      />
      <TrainerExperience
        trainerDetails={trainerDetails}
        refetchTrainerDetails={refetchTrainerDetails}
      />
      <TrainerGender
        trainerDetails={trainerDetails}
        refetchTrainerDetails={refetchTrainerDetails}
      />
    </div>
  );
};

export default TrainerAccountDetails;
