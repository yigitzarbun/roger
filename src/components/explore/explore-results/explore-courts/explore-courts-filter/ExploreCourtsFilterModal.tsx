import React from "react";
import ReactModal from "react-modal";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";

const ExploreCourtsFilterModal = (props) => {
  const {
    isCourtFilterModalOpen,
    handleCloseCourtFilterModal,
    locations,
    courtStructureTypes,
    courtSurfaceTypes,
    handleLocation,
    handleClubId,
    handleCourtSurfaceType,
    handleCourtStructureType,
    handleSubscribedClubs,
    handleClear,
    locationId,
    clubId,
    courtSurfaceType,
    courtStructureType,
    subscribedClubs,
    clubs,
  } = props;
  const { t } = useTranslation();

  return (
    <ReactModal
      isOpen={isCourtFilterModalOpen}
      onRequestClose={handleCloseCourtFilterModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div
        className={styles["overlay"]}
        onClick={handleCloseCourtFilterModal}
      />
      <div className={styles["modal-content"]}>
        <h3>{t("exploreCourtsFilterTitle")}</h3>
        <div className={styles["form-container"]}>
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
                onChange={handleCourtStructureType}
                value={courtStructureType ?? ""}
                className="input-element"
              >
                <option value="">-- {t("structure")} --</option>
                {courtStructureTypes?.map((type) => (
                  <option
                    key={type.court_structure_type_id}
                    value={type.court_structure_type_id}
                  >
                    {type?.court_structure_type_id === 1
                      ? t("courtStructureOpen")
                      : type?.court_structure_type_id === 2
                      ? t("courtStructureClosed")
                      : t("courtStructureHybrid")}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <select
                onChange={handleCourtSurfaceType}
                value={courtSurfaceType ?? ""}
                className="input-element"
              >
                <option value="">-- {t("surface")} --</option>
                {courtSurfaceTypes?.map((type) => (
                  <option
                    key={type.court_surface_type_id}
                    value={type.court_surface_type_id}
                  >
                    {type?.court_surface_type_id === 1
                      ? t("courtSurfaceHard")
                      : type?.court_surface_type_id === 2
                      ? t("courtSurfaceClay")
                      : type?.court_surface_type_id === 3
                      ? t("courtSurfaceGrass")
                      : t("courtSurfaceCarpet")}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles["input-container"]}>
              <select
                onChange={handleClubId}
                value={clubId ?? ""}
                className="input-element"
              >
                <option value="">-- {t("clubs")} --</option>
                {clubs?.map((club) => (
                  <option key={club.club_id} value={club.club_id}>
                    {club.club_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <select
                onChange={handleSubscribedClubs}
                value={subscribedClubs ? "true" : "false"}
                className="input-element"
              >
                <option key={1} value={"false"}>
                  -- {t("clubs")} --
                </option>
                <option key={2} value={"true"}>
                  {t("clubsSubscribed")}
                </option>
              </select>
            </div>
          </div>
          <div className={styles["buttons-container"]}>
            <button onClick={handleClear} className={styles["discard-button"]}>
              {t("clearButtonText")}
            </button>
            <button
              onClick={handleCloseCourtFilterModal}
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
export default ExploreCourtsFilterModal;
