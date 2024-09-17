import React, { ChangeEvent } from "react";
import ReactModal from "react-modal";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";

interface AllTournamentsFilterModalProps {
  textSearch: string;
  handleTextSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  handleClear: () => void;
  allTournamentsFilterModal: boolean;
  handleCloseAllTournamentsModal: () => void;
  handleLocation: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleGender: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleSubscriptionRequired: (event: ChangeEvent<HTMLSelectElement>) => void;
  locationId: number;
  gender: string;
  clubId: number;
  subscriptionRequired: boolean | null;
  locations: any[];
  handleClub: (event: ChangeEvent<HTMLSelectElement>) => void;
  clubs: any[];
}
const AllTournamentsFilterModal = (props: AllTournamentsFilterModalProps) => {
  const {
    textSearch,
    handleTextSearch,
    handleClear,
    allTournamentsFilterModal,
    handleCloseAllTournamentsModal,
    handleLocation,
    handleGender,
    handleSubscriptionRequired,
    gender,
    locationId,
    clubId,
    subscriptionRequired,
    locations,
    handleClub,
    clubs,
  } = props;

  const { t } = useTranslation();

  return (
    <ReactModal
      isOpen={allTournamentsFilterModal}
      onRequestClose={handleCloseAllTournamentsModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div
        className={styles["overlay"]}
        onClick={handleCloseAllTournamentsModal}
      />
      <div className={styles["modal-content"]}>
        <h3>{t("filterTournamentsTitle")}</h3>
        <div className={styles["form-container"]}>
          <div className={styles["input-outer-container"]}>
            <div className={styles["search-container"]}>
              <input
                onChange={handleTextSearch}
                value={textSearch}
                type="text"
                placeholder={t("filterTournamentsSearchPlaceHolder")}
              />
            </div>
          </div>
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <select
                onChange={handleLocation}
                value={locationId ?? ""}
                className="input-element"
              >
                <option value="">-- {t("allLocations")} --</option>
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
                onChange={handleClub}
                value={clubId ?? ""}
                className="input-element"
              >
                <option value="">-- {t("allClubs")} --</option>
                {clubs?.map((club) => (
                  <option key={club.user_id} value={club.user_id}>
                    {club.club_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <select
                onChange={handleGender}
                value={gender ?? ""}
                className="input-element"
              >
                <option key={1} value="">
                  -- {t("gender")} --
                </option>
                <option key={2} value={"female"}>
                  {t("female")}
                </option>
                <option key={3} value={"male"}>
                  {t("male")}
                </option>
              </select>
            </div>
            <div className={styles["input-container"]}>
              <select
                onChange={handleSubscriptionRequired}
                value={
                  subscriptionRequired === true
                    ? "true"
                    : subscriptionRequired === false
                    ? "false"
                    : null
                }
                className="input-element"
              >
                <option key={1} value={"null"}>
                  -- {t("tournamentsTitle")} --
                </option>
                <option key={2} value={"true"}>
                  {t("clubSubscriptionRequiredYes")}
                </option>
                <option key={3} value={"false"}>
                  {t("clubSubscriptionRequiredNo")}
                </option>
              </select>
            </div>
          </div>
          <div className={styles["buttons-container"]}>
            <button onClick={handleClear} className={styles["discard-button"]}>
              {t("clearButtonText")}
            </button>
            <button
              onClick={handleCloseAllTournamentsModal}
              className={styles["submit-button"]}
            >
              {t("applyButtonText")}
            </button>
          </div>
        </div>
      </div>
    </ReactModal>
  );
};
export default AllTournamentsFilterModal;
