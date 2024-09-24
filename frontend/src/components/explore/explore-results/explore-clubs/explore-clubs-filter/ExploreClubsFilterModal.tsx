import React from "react";
import ReactModal from "react-modal";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";

const ExploreClubsFilterModal = (props) => {
  const {
    isClubFilterModalOpen,
    handleCloseclubFilterModal,
    locations,
    clubTypes,
    courtStructureTypes,
    courtSurfaceTypes,
    handleTextSearch,
    handleLocation,
    handleClubType,
    handleCourtSurfaceType,
    handleCourtStructureType,
    handleClubTrainers,
    handleSubscribedClubs,
    handleClear,
    textSearch,
    locationId,
    clubType,
    courtSurfaceType,
    courtStructureType,
    clubTrainers,
    subscribedClubs,
  } = props;
  const { t } = useTranslation();

  return (
    <ReactModal
      isOpen={isClubFilterModalOpen}
      onRequestClose={handleCloseclubFilterModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={handleCloseclubFilterModal} />
      <div className={styles["modal-content"]}>
        <h3>{t("exploreClubsFilterTitle")}</h3>
        <div className={styles["form-container"]}>
          <div className={styles["search-container"]}>
            <input
              type="text"
              onChange={handleTextSearch}
              value={textSearch}
              placeholder={t("exploreClubsFilterSearchPlaceholder")}
            />
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
                onChange={handleClubType}
                value={clubType ?? ""}
                className="input-element"
              >
                <option value="">-- {t("tableClubTypeHeader")} --</option>
                {clubTypes?.map((type) => (
                  <option key={type.club_type_id} value={type.club_type_id}>
                    {type?.club_type_id === 1
                      ? t("clubTypePrivate")
                      : type?.club_type_id === 2
                      ? t("clubTypePublic")
                      : t("clubTypeResidential")}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles["input-outer-container"]}>
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
                      ? t("courtStructureClosed")
                      : type?.court_structure_type_id === 2
                      ? t("courtStructureOpen")
                      : t("courtStructureHybrid")}
                  </option>
                ))}
              </select>
            </div>
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
          </div>
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <select
                onChange={handleClubTrainers}
                value={clubTrainers ? "true" : "false"}
                className="input-element"
              >
                <option key={1} value={"false"}>
                  {t("allClubs")}
                </option>
                <option key={2} value={"true"}>
                  {t("clubsWithTrainers")}
                </option>
              </select>
            </div>
            <div className={styles["input-container"]}>
              <select
                onChange={handleSubscribedClubs}
                value={subscribedClubs ? "true" : "false"}
                className="input-element"
              >
                <option key={1} value={"false"}>
                  -- {t("allClubs")} --
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
              onClick={handleCloseclubFilterModal}
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
export default ExploreClubsFilterModal;
