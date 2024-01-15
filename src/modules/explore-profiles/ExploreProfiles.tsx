import React from "react";

import { useNavigate, useParams } from "react-router-dom";

import { MdArrowBackIosNew } from "react-icons/md";

import styles from "./styles.module.scss";

import ExplorePlayerProfile from "../../components/explore/explore-profiles/player/ExplorePlayerProfile";
import ExploreTrainerProfile from "../../components/explore/explore-profiles/trainer/ExploreTrainerProfile";
import ExploreClubProfile from "../../components/explore/explore-profiles/club/ExploreClubProfile";
import ExploreCourtProfile from "../../components/explore/explore-profiles/court/ExploreCourtProfile";

const ExploreProfiles = () => {
  const params = useParams();
  const navigate = useNavigate();
  const isProfilePlayer = Number(params.profile_type) === 1;
  const isProfileTrainer = Number(params.profile_type) === 2;
  const isProfileClub = Number(params.profile_type) === 3;
  const isProfileCourt = params.profile_type === "kort";
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div>
      <div className={styles["back-container"]} onClick={handleBack}>
        <MdArrowBackIosNew className={styles["back-button"]} />
        <p className={styles["back-text"]}>Geri</p>
      </div>
      {isProfilePlayer && <ExplorePlayerProfile user_id={params.id} />}
      {isProfileTrainer && <ExploreTrainerProfile user_id={params.id} />}
      {isProfileClub && <ExploreClubProfile user_id={params.id} />}
      {isProfileCourt && <ExploreCourtProfile court_id={params.id} />}
    </div>
  );
};
export default ExploreProfiles;
