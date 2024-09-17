import React, { ChangeEvent } from "react";
import ReactModal from "react-modal";
import styles from "./styles.module.scss";

import { useGetClubSubscriptionTypesQuery } from "../../../../../api/endpoints/ClubSubscriptionTypesApi";
import { useGetLocationsQuery } from "../../../../../api/endpoints/LocationsApi";
import { useGetPlayerLevelsQuery } from "../../../../../api/endpoints/PlayerLevelsApi";
import { useGetUserTypesQuery } from "../../../../../api/endpoints/UserTypesApi";

interface ClubSubscriptionsFilterModalProps {
  subscriberFilterModalOpen: boolean;
  textSearch: string;
  clubSubscriptionTypeId: number | null;
  playerLevelId: number | null;
  locationId: number | null;
  userTypeId: number | null;
  handleCloseSubscribersFilterModal: () => void;
  handleTextSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSubscriptionType: (event: ChangeEvent<HTMLSelectElement>) => void;
  handlePlayerLevel: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleLocation: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleUserType: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleClear: () => void;
}

const ClubSubscriptionsFilterModal = (
  props: ClubSubscriptionsFilterModalProps
) => {
  const {
    subscriberFilterModalOpen,
    textSearch,
    clubSubscriptionTypeId,
    playerLevelId,
    locationId,
    userTypeId,
    handleCloseSubscribersFilterModal,
    handleTextSearch,
    handleSubscriptionType,
    handlePlayerLevel,
    handleLocation,
    handleUserType,
    handleClear,
  } = props;

  const { data: subscriptionTypes, isLoading: isSubscriptionTypesLoading } =
    useGetClubSubscriptionTypesQuery({});
  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});
  const { data: playerLevels, isLoading: isPlayerLevelsLoading } =
    useGetPlayerLevelsQuery({});
  const { data: userTypes, isLoading: isUserTypesLoading } =
    useGetUserTypesQuery({});
  return (
    <ReactModal
      isOpen={subscriberFilterModalOpen}
      onRequestClose={handleCloseSubscribersFilterModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div
        className={styles["overlay"]}
        onClick={handleCloseSubscribersFilterModal}
      />
      <div className={styles["modal-content"]}>
        <h3>Üyeleri Filtrele</h3>
        <div className={styles["form-container"]}>
          <div className={styles["search-container"]}>
            <input
              type="text"
              onChange={handleTextSearch}
              value={textSearch}
              placeholder="Üye adı"
            />
          </div>
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <select
                onChange={handleSubscriptionType}
                value={clubSubscriptionTypeId ?? ""}
                className="input-element"
              >
                <option value="">-- Üyelik Türü --</option>
                {subscriptionTypes?.map((type) => (
                  <option
                    key={type.club_subscription_type_id}
                    value={type.club_subscription_type_id}
                  >
                    {type.club_subscription_type_name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles["input-container"]}>
              <select
                onChange={handlePlayerLevel}
                value={playerLevelId ?? ""}
                className="input-element"
              >
                <option value="">-- Seviye --</option>
                {playerLevels.map((level) => (
                  <option
                    key={level.player_level_id}
                    value={level.player_level_id}
                  >
                    {level.player_level_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <select
                onChange={handleLocation}
                value={locationId ?? ""}
                className="input-element"
              >
                <option value="">-- Tüm Konumlar --</option>
                {locations?.map((location) => (
                  <option
                    key={location.location_id}
                    value={location.location_id}
                  >
                    {location.location_name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles["input-container"]}>
              <select
                onChange={handleUserType}
                value={userTypeId ?? ""}
                className="input-element"
              >
                <option value="">-- Üye Türü --</option>
                {userTypes
                  ?.filter(
                    (type) => type.user_type_id === 1 || type.user_type_id === 5
                  )
                  ?.map((type) => (
                    <option key={type.user_type_id} value={type.user_type_id}>
                      {type.user_type_name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className={styles["buttons-container"]}>
            <button onClick={handleClear} className={styles["discard-button"]}>
              Temizle
            </button>
            <button
              onClick={handleCloseSubscribersFilterModal}
              className={styles["submit-button"]}
            >
              Uygula
            </button>
          </div>
        </div>
      </div>
    </ReactModal>
  );
};

export default ClubSubscriptionsFilterModal;
