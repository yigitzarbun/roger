import React, { useState, ChangeEvent } from "react";

import styles from "./styles.module.scss";

import LessonResults from "../../components/lesson/results/LessonResults";
import LessonSearch from "../../components/lesson/search/LessonsSearch";

const Lesson = () => {
  const [trainerLevelId, setTrainerLevelId] = useState<number | null>(null);
  const [gender, setGender] = useState<string>("");
  const [locationId, setLocationId] = useState<number | null>(null);
  const [clubId, setClubId] = useState<number | null>(null);
  const [favourite, setFavourite] = useState<boolean | null>(false);
  const [textSearch, setTextSearch] = useState<string>("");

  const handleTextSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setTextSearch(event.target.value);
  };

  const handleLevel = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setTrainerLevelId(isNaN(value) ? null : value);
  };

  const handleGender = (event: ChangeEvent<HTMLSelectElement>) => {
    setGender(event.target.value);
  };

  const handleLocation = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setLocationId(isNaN(value) ? null : value);
  };

  const handleClub = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setClubId(isNaN(value) ? null : value);
  };

  const handleFavourite = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setFavourite(value === "true");
  };

  const [filterOpen, setFilterOpen] = useState(false);
  const handleOpenFilter = () => {
    filterOpen ? setFilterOpen(false) : setFilterOpen(true);
  };

  const handleClear = () => {
    setTextSearch("");
    setTrainerLevelId(null);
    setGender("");
    setLocationId(null);
    setClubId(null);
    setFavourite(null);
  };
  return (
    <div className={styles["lesson-container"]}>
      {filterOpen && (
        <LessonSearch
          handleLevel={handleLevel}
          handleGender={handleGender}
          handleLocation={handleLocation}
          handleClub={handleClub}
          handleTextSearch={handleTextSearch}
          handleFavourite={handleFavourite}
          handleClear={handleClear}
          trainerLevelId={trainerLevelId}
          gender={gender}
          locationId={locationId}
          clubId={clubId}
          textSearch={textSearch}
          favourite={favourite}
        />
      )}

      <LessonResults
        trainerLevelId={trainerLevelId}
        gender={gender}
        locationId={locationId}
        clubId={clubId}
        textSearch={textSearch}
        favourite={favourite}
        handleOpenFilter={handleOpenFilter}
      />
    </div>
  );
};
export default Lesson;
