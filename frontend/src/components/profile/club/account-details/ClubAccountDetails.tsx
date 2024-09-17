import React, { useState } from "react";
import styles from "./styles.module.scss";
import ClubImage from "./club-image/ClubImage";
import ClubName from "./club-name/ClubName";
import ClubLocation from "./club-location/ClubLocation";
import ClubType from "./club-type/ClubType";

interface ClubProfileDetails {
  clubDetails: any;
  refetchClubDetails: () => void;
}
const ClubAccountDetails = (props: ClubProfileDetails) => {
  const { clubDetails, refetchClubDetails } = props;

  return (
    <div className={styles["club-account-details"]}>
      <ClubImage
        clubDetails={clubDetails}
        refetchClubDetails={refetchClubDetails}
      />
      <ClubName
        clubDetails={clubDetails}
        refetchClubDetails={refetchClubDetails}
      />
      <ClubLocation
        clubDetails={clubDetails}
        refetchClubDetails={refetchClubDetails}
      />
      <ClubType
        clubDetails={clubDetails}
        refetchClubDetails={refetchClubDetails}
      />
    </div>
  );
};

export default ClubAccountDetails;
