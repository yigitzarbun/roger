import React, { ChangeEvent } from "react";
import ReactModal from "react-modal";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";

interface MyTournamentsFilterModalProps {
  textSearch: string;
  handleTextSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  handleClear: () => void;
  myTournamentsFilterModal: boolean;
  handleCloseMyTournamentsModal: () => void;
  handleLocation: (event: ChangeEvent<HTMLSelectElement>) => void;
  locationId: number;
  clubId: number;
  locations: any[];
  handleClub: (event: ChangeEvent<HTMLSelectElement>) => void;
  clubs: any[];
}
const MyTournamentsFilterModal = (props: MyTournamentsFilterModalProps) => {
  const {
    textSearch,
    handleTextSearch,
    handleClear,
    myTournamentsFilterModal,
    handleCloseMyTournamentsModal,
    handleLocation,
    locationId,
    clubId,
    locations,
    handleClub,
    clubs,
  } = props;

  const { t } = useTranslation();

  return (
    <ReactModal
      isOpen={myTournamentsFilterModal}
      onRequestClose={handleCloseMyTournamentsModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div
        className={styles["overlay"]}
        onClick={handleCloseMyTournamentsModal}
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
          <div className={styles["buttons-container"]}>
            <button onClick={handleClear} className={styles["discard-button"]}>
              {t("clearButtonText")}
            </button>
            <button
              onClick={handleCloseMyTournamentsModal}
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

export default MyTournamentsFilterModal;
