import React, { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import { CourtStructureType } from "../../../../api/endpoints/CourtStructureTypesApi";
import { CourtSurfaceType } from "../../../../api/endpoints/CourtSurfaceTypesApi";

interface ClubCourtSearchProps {
  handleSurface: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleStructure: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleTextSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  handleCourtStatus: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleClear: () => void;
  surfaceTypeId: number;
  structureTypeId: number;
  courtStructureTypes: CourtStructureType[];
  courtSurfaceTypes: CourtSurfaceType[];
  textSearch: string;
  courtStatus: boolean | null;
}

const ClubCourtsSearch = (props: ClubCourtSearchProps) => {
  const {
    handleSurface,
    handleStructure,
    handleTextSearch,
    handleCourtStatus,
    handleClear,
    surfaceTypeId,
    structureTypeId,
    courtStructureTypes,
    courtSurfaceTypes,
    textSearch,
    courtStatus,
  } = props;

  const { t } = useTranslation();

  return (
    <div className={styles["courts-page-container"]}>
      <div className={styles["search-container"]}>
        <input
          type="text"
          onChange={handleTextSearch}
          value={textSearch}
          placeholder={t("courtName")}
        />
      </div>
      <div className={styles["input-container"]}>
        <select onChange={handleSurface} value={surfaceTypeId ?? ""}>
          <option value="">-- {t("tableSurfaceHeader")} --</option>
          {courtSurfaceTypes?.map((court_surface_type) => (
            <option
              key={court_surface_type.court_surface_type_id}
              value={court_surface_type.court_surface_type_id}
            >
              {court_surface_type?.court_surface_type_id === 1
                ? t("courtSurfaceHard")
                : court_surface_type?.court_surface_type_id === 2
                ? t("courtSurfaceClay")
                : court_surface_type?.court_surface_type_id === 3
                ? t("courtSurfaceGrass")
                : t("courtSurfaceCarpet")}
            </option>
          ))}
        </select>
      </div>
      <div className={styles["input-container"]}>
        <select onChange={handleStructure} value={structureTypeId ?? ""}>
          <option value="">-- {t("tableStructureHeader")} --</option>
          {courtStructureTypes?.map((court_structure_type) => (
            <option
              key={court_structure_type.court_structure_type_id}
              value={court_structure_type.court_structure_type_id}
            >
              {court_structure_type?.court_structure_type_id === 1
                ? t("courtStructureClosed")
                : court_structure_type?.court_structure_type_id === 2
                ? t("courtStructureOpen")
                : t("courtStructureHybrid")}
            </option>
          ))}
        </select>
      </div>
      <div className={styles["input-container"]}>
        <select
          onChange={handleCourtStatus}
          value={
            courtStatus === true
              ? "true"
              : courtStatus === false
              ? "false"
              : "null"
          }
        >
          <option value={"null"}>-- {t("tableStatusHeader")} --</option>
          <option value={"true"}>{t("activeCourts")}</option>
          <option value={"false"}>{t("passiveCourts")}</option>
        </select>
      </div>
      <button
        onClick={handleClear}
        className={
          surfaceTypeId > 0 ||
          textSearch !== "" ||
          structureTypeId > 0 ||
          courtStatus !== null
            ? styles["active-clear-button"]
            : styles["passive-clear-button"]
        }
      >
        {t("clearButtonText")}
      </button>
    </div>
  );
};

export default ClubCourtsSearch;
