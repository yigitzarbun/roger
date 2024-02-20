import React, { useState } from "react";

import styles from "./styles.module.scss";

import ExploreClubSubscribersModal from "../../modals/subscribers/ExploreClubSubscribersModal";

import { ClubSubscription } from "../../../../../../api/endpoints/ClubSubscriptionsApi";

interface ExploreClubsSubscribersSectionProps {
  selectedClub: any;
  selectedClubSubscribers: ClubSubscription[];
}
const ExploreClubsSubscribersSection = (
  props: ExploreClubsSubscribersSectionProps
) => {
  const { selectedClub, selectedClubSubscribers } = props;
  const [isSubscribersModalOpen, setIsSubscribersModalOpen] = useState(false);
  const openSubscribersModal = () => {
    setIsSubscribersModalOpen(true);
  };
  const closeSubscribersModal = () => {
    setIsSubscribersModalOpen(false);
  };

  return (
    <div className={styles["subscribers-section"]}>
      <h2>Üyeler</h2>
      <p>{`${selectedClubSubscribers?.length} oyuncu üye oldu`}</p>
      <button onClick={openSubscribersModal}>Tümünü Gör</button>
      {isSubscribersModalOpen && (
        <ExploreClubSubscribersModal
          isSubscribersModalOpen={isSubscribersModalOpen}
          closeSubscribersModal={closeSubscribersModal}
          selectedClub={selectedClub}
          selectedClubSubscribers={selectedClubSubscribers}
        />
      )}
    </div>
  );
};
export default ExploreClubsSubscribersSection;
