import React, { ChangeEvent } from "react";

import styles from "./styles.module.scss";

import { useGetLocationsQuery } from "../../../api/endpoints/LocationsApi";
import PageLoading from "../../../components/loading/PageLoading";
import { useGetUserTypesQuery } from "../../../api/endpoints/UserTypesApi";

interface TrainSearchProps {
  handleLocation: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleTextSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  handleUserType: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleClear: () => void;
  locationId: number;
  textSearch: string;
  userTypeId: number;
}

const FavouritesFilter = (props: TrainSearchProps) => {
  const {
    handleLocation,
    handleTextSearch,
    handleUserType,
    handleClear,
    locationId,
    userTypeId,
    textSearch,
  } = props;

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const { data: userTypes, isLoading: isUserTypesLoading } =
    useGetUserTypesQuery({});

  if (isLocationsLoading || isUserTypesLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["lesson-page-container"]}>
      <div className={styles["search-container"]}>
        <input
          type="text"
          onChange={handleTextSearch}
          value={textSearch}
          placeholder="Eğitmen adı"
        />
      </div>

      <div className={styles["input-container"]}>
        <select
          onChange={handleLocation}
          value={locationId ?? ""}
          className="input-element"
        >
          <option value="">-- Konum --</option>
          {locations?.map((location) => (
            <option key={location.location_id} value={location.location_id}>
              {location.location_name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles["input-container"]}>
        <select
          onChange={handleUserType}
          value={userTypeId ?? ""}
          className="input-element"
        >
          <option value="">-- Tür --</option>
          {userTypes?.map((userType) => (
            <option key={userType.user_type_id} value={userType.user_type_id}>
              {userType.user_type_name}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleClear}
        className={
          textSearch !== "" || locationId > 0
            ? styles["active-clear-button"]
            : styles["passive-clear-button"]
        }
      >
        Temizle
      </button>
    </div>
  );
};

export default FavouritesFilter;
