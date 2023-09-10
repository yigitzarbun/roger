import React, { ChangeEvent } from "react";

import styles from "./styles.module.scss";

import {
  CourtStructureType,
  useGetCourtStructureTypesQuery,
} from "../../../api/endpoints/CourtStructureTypesApi";
import {
  CourtSurfaceType,
  useGetCourtSurfaceTypesQuery,
} from "../../../api/endpoints/CourtSurfaceTypesApi";
import PageLoading from "../../../components/loading/PageLoading";

interface ClubCourtSearchProps {
  handleSurface: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleStructure: (event: ChangeEvent<HTMLSelectElement>) => void;
  handlePrice: (event: ChangeEvent<HTMLInputElement>) => void;
  handleClear: () => void;
  surfaceTypeId: number;
  structureTypeId: number;
  price: number;
  courtStructureTypes: CourtStructureType[];
  courtSurfaceTypes: CourtSurfaceType[];
}

const ClubCourtsSearch = (props: ClubCourtSearchProps) => {
  const {
    handleSurface,
    handleStructure,
    handlePrice,
    handleClear,
    surfaceTypeId,
    structureTypeId,
    price,
    courtStructureTypes,
    courtSurfaceTypes,
  } = props;

  return (
    <div className={styles["courts-page-container"]}>
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
      <div className={styles["price-input"]}>
        <label> {`Fiyat:  ${price} TL / saat`}</label>
        <input
          type="number"
          min={1}
          max={2500}
          value={price}
          onChange={handlePrice}
        />
      </div>
      <button onClick={handleClear} className={styles["button"]}>
        Temizle
      </button>
    </div>
  );
};

export default ClubCourtsSearch;
