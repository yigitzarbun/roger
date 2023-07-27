import React, { ChangeEvent } from "react";

import styles from "./styles.module.scss";

import { useGetCourtStructureTypesQuery } from "../../../api/endpoints/CourtStructureTypesApi";
import { useGetCourtSurfaceTypesQuery } from "../../../api/endpoints/CourtSurfaceTypesApi";

interface ClubCourtSearchProps {
  handleSurface: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleStructure: (event: ChangeEvent<HTMLSelectElement>) => void;
  handlePrice: (event: ChangeEvent<HTMLInputElement>) => void;
  handleClear: () => void;
  surfaceTypeId: number;
  structureTypeId: number;
  price: number;
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
  } = props;

  const { data: courtStructureTypes, isLoading: isCourtStructureTypesLoading } =
    useGetCourtStructureTypesQuery({});

  const { data: courtSurfaceTypes, isLoading: isCourtSurfaceTypesLoading } =
    useGetCourtSurfaceTypesQuery({});

  if (isCourtStructureTypesLoading || isCourtSurfaceTypesLoading) {
    return <div>Yükleniyor..</div>;
  }

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
