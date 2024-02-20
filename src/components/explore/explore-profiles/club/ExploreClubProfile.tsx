import React from "react";

import styles from "./styles.module.scss";

import { useGetClubProfileDetailsQuery } from "../../../../api/endpoints/ClubsApi";

import { useGetClubSubscriptionsByFilterQuery } from "../../../../api/endpoints/ClubSubscriptionsApi";

import { useAppSelector } from "../../../../store/hooks";

import PageLoading from "../../../../components/loading/PageLoading";
import ExploreClubsProfileSection from "./sections/profile/ExploreClubsProfileSection";
import ExploreClubsCourtsSection from "./sections/courts/ExploreClubsCourtsSection";
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
    useGetClubProfileDetailsQuery(user_id);

  console.log(selectedClub);
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
      <ExploreClubsProfileSection selectedClub={selectedClub} />

      <ExploreClubsCourtsSection selectedClub={selectedClub} />
      <ExploreClubsTrainersSection
        isUserTrainer={isUserTrainer}
        isUserPlayer={isUserPlayer}
        selectedClub={selectedClub}
      />

      <ExploreClubsSubscribersSection
        selectedClub={selectedClub}
        selectedClubSubscribers={selectedClubSubscribers}
      />
      <ExploreClubsSubscriptionsSection
        selectedClub={selectedClub}
        selectedClubSubscribers={selectedClubSubscribers}
        isUserPlayer={isUserPlayer}
      />

      <ExploreClubsRulesSection selectedClub={selectedClub} />
    </div>
  );
};
export default ExploreClubProfile;
