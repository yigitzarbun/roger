import React, { useState, ChangeEvent } from "react";

import styles from "./styles.module.scss";

import LessonHero from "../../components/lesson/hero/LessonHero";
import LessonResults from "../../components/lesson/results/LessonResults";
import LessonSearch from "../../components/lesson/search/LessonsSearch";

const Lesson = () => {
  const [trainerLevelId, setTrainerLevelId] = useState<number | null>(null);
  const [trainerPrice, setTrainerPrice] = useState<number>(100);
  const [gender, setGender] = useState<string>("");
  const [locationId, setLocationId] = useState<number | null>(null);
  const [clubId, setClubId] = useState<number | null>(null);
  const [favourite, setFavourite] = useState<boolean | null>(null);

  const handleLevel = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setTrainerLevelId(isNaN(value) ? null : value);
  };

  const handleGender = (event: ChangeEvent<HTMLSelectElement>) => {
    setGender(event.target.value);
  };

  const handlePrice = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setTrainerPrice(isNaN(value) ? null : value);
  };

  const handleLocation = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setLocationId(isNaN(value) ? null : value);
  };

  const handleClub = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setClubId(isNaN(value) ? null : value);
  };

  const handleFavourite = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;
    setFavourite(value);
  };

  const handleClear = () => {
    setTrainerLevelId(null);
    setGender("");
    setTrainerPrice(100);
    setLocationId(null);
    setClubId(null);
    setFavourite(null);
  };
  return (
    <div className={styles["lesson-container"]}>
      <LessonHero />
      <LessonSearch
        handleLevel={handleLevel}
        handleGender={handleGender}
        handlePrice={handlePrice}
        handleLocation={handleLocation}
        handleClub={handleClub}
        handleFavourite={handleFavourite}
        handleClear={handleClear}
        trainerLevelId={trainerLevelId}
        trainerPrice={trainerPrice}
        gender={gender}
        locationId={locationId}
        clubId={clubId}
        favourite={favourite}
      />
      <LessonResults
        trainerLevelId={trainerLevelId}
        trainerPrice={trainerPrice}
        gender={gender}
        locationId={locationId}
        clubId={clubId}
        favourite={favourite}
      />
    </div>
  );
};
export default Lesson;
