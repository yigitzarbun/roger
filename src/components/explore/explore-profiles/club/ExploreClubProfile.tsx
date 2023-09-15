import React from "react";

import styles from "./styles.module.scss";

import { useGetClubByUserIdQuery } from "../../../../api/endpoints/ClubsApi";

import { useGetClubSubscriptionsByFilterQuery } from "../../../../api/endpoints/ClubSubscriptionsApi";

import { useAppSelector } from "../../../../store/hooks";

import PageLoading from "../../../../components/loading/PageLoading";
import ExploreClubsProfileSection from "./sections/profile/ExploreClubsProfileSection";
import ExploreClubsCourtsSection from "./sections/courts/ExploreClubsCourtsSection";
import ExploreClubsFavouritesSection from "./sections/favourites/ExploreClubsFavouritesSection";
import ExploreClubsTrainersSection from "./sections/trainers/ExploreClubsTrainersSection";
import ExploreClubsSubscribersSection from "./sections/subscribers/ExploreClubsSubscribersSection";
import ExploreClubsSubscriptionsSection from "./sections/subscriptions/ExploreClubsSubscriptionsSection";
import ExploreClubsRulesSection from "./sections/rules/ExploreClubsRulesSection";

interface ExploreClubProfileProps {
  user_id: string;
}
const ExploreClubProfile = (props: ExploreClubProfileProps) => {
  const { user_id } = props;

  const user = useAppSelector((store) => store.user?.user);

  const isUserPlayer = user?.user?.user_type_id === 1;
  const isUserTrainer = user?.user?.user_type_id === 2;

  const { data: selectedClub, isLoading: isSelectedClubLoading } =
    useGetClubByUserIdQuery(user_id);

  // subscriptions

  const {
    data: selectedClubSubscribers,
    isLoading: isSelectedClubSubscriptionsLoading,
  } = useGetClubSubscriptionsByFilterQuery({
    is_active: true,
    club_id: selectedClub?.[0]?.user_id,
  });

  if (isSelectedClubSubscriptionsLoading || isSelectedClubLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles.profile}>
      <div className={styles["top-sections-container"]}>
        <ExploreClubsProfileSection selectedClub={selectedClub} />
        <ExploreClubsCourtsSection selectedClub={selectedClub} />
      </div>
      <div className={styles["mid-top-sections-container"]}>
        <ExploreClubsFavouritesSection selectedClub={selectedClub} />
        <ExploreClubsTrainersSection
          isUserTrainer={isUserTrainer}
          isUserPlayer={isUserPlayer}
          selectedClub={selectedClub}
        />
      </div>
      <div className={styles["mid-bottom-sections-container"]}>
        <ExploreClubsSubscribersSection
          selectedClub={selectedClub}
          selectedClubSubscribers={selectedClubSubscribers}
        />
        <ExploreClubsSubscriptionsSection
          selectedClub={selectedClub}
          selectedClubSubscribers={selectedClubSubscribers}
          isUserPlayer={isUserPlayer}
        />
      </div>
      <div className={styles["bottom-section-container"]}>
        <ExploreClubsRulesSection selectedClub={selectedClub} />
      </div>
    </div>
  );
};
export default ExploreClubProfile;
