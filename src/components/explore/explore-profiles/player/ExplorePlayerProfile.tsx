import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./styles.module.scss";

import PageLoading from "../../../../components/loading/PageLoading";

import { useGetPlayerProfileDetailsQuery } from "../../../../api/endpoints/PlayersApi";

import ExplorePlayersInteractionsSections from "./sections/interaction/ExplorePlayersInteractionsSections";
import ExplorePlayersReviewsSection from "./sections/reviews/ExplorePlayersReviewsSection";
import ExplorePlayerProfilesEventsSection from "./sections/events/ExplorePlayerProfilesEventsSection";
import Paths from "../../../../routing/Paths";

interface ExplorePlayerProfileProps {
  user_id: string;
}
const ExplorePlayerProfile = (props: ExplorePlayerProfileProps) => {
  const { user_id } = props;

  const navigate = useNavigate();

  const { data: selectedPlayer, isLoading: isSelectedPlayerLoading } =
    useGetPlayerProfileDetailsQuery(Number(user_id));

  useEffect(() => {
    if (selectedPlayer && selectedPlayer?.user_status_type_id !== 1) {
      navigate(Paths.HOME);
    }
  }, [selectedPlayer, isSelectedPlayerLoading]);

  if (isSelectedPlayerLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles.profile}>
      <div className={styles["top-sections-container"]}>
        <ExplorePlayersInteractionsSections
          selectedPlayer={selectedPlayer}
          user_id={Number(user_id)}
        />
      </div>
      <div>
        <ExplorePlayersReviewsSection selectedPlayer={selectedPlayer} />
      </div>
      <div>
        <ExplorePlayerProfilesEventsSection selectedPlayer={selectedPlayer} />
      </div>
    </div>
  );
};
export default ExplorePlayerProfile;
