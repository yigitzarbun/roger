import React, { ChangeEvent } from "react";

import styles from "./styles.module.scss";

import {
  CourtStructureType,
  useGetCourtStructureTypesQuery,
} from "../../../../api/endpoints/CourtStructureTypesApi";
import {
  CourtSurfaceType,
  useGetCourtSurfaceTypesQuery,
} from "../../../../api/endpoints/CourtSurfaceTypesApi";
import PageLoading from "../../../components/loading/PageLoading";

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

  return (
    <div className={styles["courts-page-container"]}>
      <div className={styles["search-container"]}>
        <input
          type="text"
          onChange={handleTextSearch}
          value={textSearch}
          placeholder="Kort adı"
        />
      </div>
      <div className={styles["input-container"]}>
        <select onChange={handleSurface} value={surfaceTypeId ?? ""}>
          <option value="">-- Yüzey --</option>
          {courtSurfaceTypes?.map((court_surface_type) => (
            <option
              key={court_surface_type.court_surface_type_id}
              value={court_surface_type.court_surface_type_id}
            >
              {court_surface_type.court_surface_type_name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles["input-container"]}>
        <select onChange={handleStructure} value={structureTypeId ?? ""}>
          <option value="">-- Mekan --</option>
          {courtStructureTypes?.map((court_structure_type) => (
            <option
              key={court_structure_type.court_structure_type_id}
              value={court_structure_type.court_structure_type_id}
            >
              {court_structure_type.court_structure_type_name}
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
          <option value={"null"}>-- Tüm kortlar --</option>
          <option value={"true"}>Aktif kortlar</option>
          <option value={"false"}>Bloke kortlar</option>
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
        Temizle
      </button>
    </div>
  );
};

export default ClubCourtsSearch;
