import React, { useState, ChangeEvent } from "react";

import styles from "./styles.module.scss";

import ClubSubscriptionsNavigation from "../../components/club-subscriptions/navigation/ClubSubscriptionsNavigation";
import ClubSubscriptionPackages from "../../components/club-subscriptions/subscription-packages/ClubSubscriptionPackages";
import ClubSubscribersResults from "../../components/club-subscriptions/subscriber-list/ClubSubscribersResults";
import ClubGroupsResults from "../../components/club-subscriptions/groups-list/ClubGroupsResults";
import { useGetClubProfileDetailsQuery } from "../../../api/endpoints/ClubsApi";
import { useAppSelector } from "../../store/hooks";
import PageLoading from "../../components/loading/PageLoading";

const ClubSubscriptions = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const {
    data: currentClub,
    isLoading: isClubDetailsLoading,
    refetch: refetchClubDetails,
  } = useGetClubProfileDetailsQuery(user?.user?.user_id);

  const [display, setDisplay] = useState("subscriptions");
  const handleDisplay = (value: string) => {
    setDisplay(value);
  };
  const [textSearch, setTextSearch] = useState<string>("");
  const [clubSubscriptionTypeId, setClubSubscriptionTypeId] = useState<
    number | null
  >(null);
  const [playerLevelId, setPlayerLevelId] = useState<number | null>(null);
  const [locationId, setLocationId] = useState<number | null>(null);
  const [userTypeId, setUserTypeId] = useState<number | null>(null);

  const handleTextSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setTextSearch(event.target.value);
  };

  const handleSubscriptionType = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setClubSubscriptionTypeId(isNaN(value) ? null : value);
  };

  const handlePlayerLevel = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setPlayerLevelId(isNaN(value) ? null : value);
  };

  const handleLocation = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setLocationId(isNaN(value) ? null : value);
  };

  const handleUserType = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setUserTypeId(isNaN(value) ? null : value);
  };

  const handleClear = () => {
    setTextSearch("");
    setClubSubscriptionTypeId(null);
    setPlayerLevelId(null);
    setLocationId(null);
    setUserTypeId(null);
  };
  if (isClubDetailsLoading) {
    return <PageLoading />;
  }
  return (
    <div className={styles["club-subscriptions-container"]}>
      <ClubSubscriptionsNavigation
        display={display}
        handleDisplay={handleDisplay}
      />
      {display === "subscriptions" && (
        <ClubSubscriptionPackages
          currentClub={currentClub}
          refetchClubDetails={refetchClubDetails}
        />
      )}
      {display === "subscribers" && (
        <ClubSubscribersResults
          textSearch={textSearch}
          clubSubscriptionTypeId={clubSubscriptionTypeId}
          playerLevelId={playerLevelId}
          locationId={locationId}
          userTypeId={userTypeId}
          handleTextSearch={handleTextSearch}
          handleSubscriptionType={handleSubscriptionType}
          handlePlayerLevel={handlePlayerLevel}
          handleLocation={handleLocation}
          handleUserType={handleUserType}
          handleClear={handleClear}
          currentClub={currentClub}
          refetchClubDetails={refetchClubDetails}
        />
      )}
      {display === "groups" && (
        <ClubGroupsResults
          textSearch={textSearch}
          handleTextSearch={handleTextSearch}
          handleClear={handleClear}
        />
      )}
    </div>
  );
};
export default ClubSubscriptions;
