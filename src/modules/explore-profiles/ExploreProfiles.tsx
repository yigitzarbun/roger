import React from "react";

import { useParams } from "react-router-dom";

import ExplorePlayerProfile from "../../components/explore/explore-profiles/player/ExplorePlayerProfile";
import ExploreTrainerProfile from "../../components/explore/explore-profiles/trainer/ExploreTrainerProfile";
import ExploreClubProfile from "../../components/explore/explore-profiles/club/ExploreClubProfile";
import ExploreCourtProfile from "../../components/explore/explore-profiles/court/ExploreCourtProfile";

const ExploreProfiles = () => {
  const params = useParams();
  const isProfilePlayer = Number(params.profile_type) === 1;
  const isProfileTrainer = Number(params.profile_type) === 2;
  const isProfileClub = Number(params.profile_type) === 3;
  const isProfileCourt = params.profile_type === "kort";

  return (
    <div>
      {isProfilePlayer && <ExplorePlayerProfile user_id={params.id} />}
      {isProfileTrainer && <ExploreTrainerProfile user_id={params.id} />}
      {isProfileClub && <ExploreClubProfile user_id={params.id} />}
      {isProfileCourt && <ExploreCourtProfile court_id={params.id} />}
    </div>
  );
};
export default ExploreProfiles;
