import React from "react";
import ReactModal from "react-modal";
import styles from "./styles.module.scss";

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
        <h3>Kortları Filtrele</h3>
        <div className={styles["form-container"]}>
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <select
                onChange={handleLocation}
                value={locationId ?? ""}
                className="input-element"
              >
                <option value="">-- Konum --</option>
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
                <option value="">-- Mekan --</option>
                {courtStructureTypes?.map((type) => (
                  <option
                    key={type.court_structure_type_id}
                    value={type.court_structure_type_id}
                  >
                    {type.court_structure_type_name}
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
                <option value="">-- Zemin --</option>
                {courtSurfaceTypes?.map((type) => (
                  <option
                    key={type.court_surface_type_id}
                    value={type.court_surface_type_id}
                  >
                    {type.court_surface_type_name}
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
                <option value="">-- Kulüp --</option>
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
                  -- Tüm Kulüpler --
                </option>
                <option key={2} value={"true"}>
                  Yalnızca üyeliğim olan kulüpler
                </option>
              </select>
            </div>
          </div>
          <div className={styles["buttons-container"]}>
            <button onClick={handleClear} className={styles["discard-button"]}>
              Temizle
            </button>
            <button
              onClick={handleCloseCourtFilterModal}
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
export default ExploreCourtsFilterModal;
