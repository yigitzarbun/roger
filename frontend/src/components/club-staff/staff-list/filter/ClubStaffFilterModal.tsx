import React from "react";
import ReactModal from "react-modal";
import styles from "./styles.module.scss";
import { useGetLocationsQuery } from "../../../../../api/endpoints/LocationsApi";
import { useGetClubStaffRoleTypesQuery } from "../../../../../api/endpoints/ClubStaffRoleTypesApi";

const ClubStaffFilterModal = (props) => {
  const {
    locationId,
    gender,
    roleId,
    textSearch,
    handleClear,
    handleTextSearch,
    handleLocation,
    handleGender,
    handleRole,
    closeStaffFilterModal,
    isStaffFilterModalOpen,
  } = props;

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});
  const { data: clubStaffRoleTypes, isLoading: isClubStaffRoleTypesLoading } =
    useGetClubStaffRoleTypesQuery({});

  return (
    <ReactModal
      isOpen={isStaffFilterModalOpen}
      onRequestClose={closeStaffFilterModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={closeStaffFilterModal} />
      <div className={styles["modal-content"]}>
        <h3>Eğitmenleri Filtrele</h3>
        <div className={styles["form-container"]}>
          <div className={styles["search-container"]}>
            <input
              type="text"
              onChange={handleTextSearch}
              value={textSearch}
              placeholder="Personel adı"
            />
          </div>
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <select
                onChange={handleRole}
                value={roleId ?? ""}
                className="input-element"
              >
                <option value="">-- Tüm Roller --</option>
                {clubStaffRoleTypes?.map((role) => (
                  <option
                    key={role.club_staff_role_type_id}
                    value={role.club_staff_role_type_id}
                  >
                    {role.club_staff_role_type_name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles["input-container"]}>
              <select
                onChange={handleGender}
                value={gender}
                className="input-element"
              >
                <option value="">-- Cinsiyet --</option>
                <option value="female">Kadın</option>
                <option value="male">Erkek</option>
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
          </div>
          <div className={styles["buttons-container"]}>
            <button onClick={handleClear} className={styles["discard-button"]}>
              Temizle
            </button>
            <button
              onClick={closeStaffFilterModal}
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
export default ClubStaffFilterModal;
