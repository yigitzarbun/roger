import React from "react";
import ReactModal from "react-modal";
import styles from "./styles.module.scss";
import { useGetLocationsQuery } from "../../../../../api/endpoints/LocationsApi";
import { useGetClubStaffRoleTypesQuery } from "../../../../../api/endpoints/ClubStaffRoleTypesApi";
import { useTranslation } from "react-i18next";

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

  const { t } = useTranslation();

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
        <h3>{t("clubStaffFilterTitle")}</h3>
        <div className={styles["form-container"]}>
          <div className={styles["search-container"]}>
            <input
              type="text"
              onChange={handleTextSearch}
              value={textSearch}
              placeholder={t("clubStaffNamePlaceholder")}
            />
          </div>
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <select
                onChange={handleRole}
                value={roleId ?? ""}
                className="input-element"
              >
                <option value="">-- {t("role")} --</option>
                {clubStaffRoleTypes?.map((role) => (
                  <option
                    key={role.club_staff_role_type_id}
                    value={role.club_staff_role_type_id}
                  >
                    {role.club_staff_role_type_id === 1
                      ? t("managerial")
                      : role.club_staff_role_type_id === 2
                      ? t("userTypeTrainer")
                      : t("other")}
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
                <option value="">
                  -- {t("leaderboardTableGenderHeader")} --
                </option>
                <option value="female">{t("female")}</option>
                <option value="male">{t("male")}</option>
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
          </div>
          <div className={styles["buttons-container"]}>
            <button onClick={handleClear} className={styles["discard-button"]}>
              {t("clearButtonText")}
            </button>
            <button
              onClick={closeStaffFilterModal}
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
export default ClubStaffFilterModal;
