import React, { useState, ChangeEvent } from "react";

import styles from "./styles.module.scss";

import TrainerStudentsResults from "../../components/trainer-students/results/TrainerStudentsResults";
import TrainerStudentsNavigation from "../../components/trainer-students/navigation/TrainerStudentsNavigation";
import TrainerStudentRequests from "../../components/trainer-students/new-student-requests/TrainerStudentRequests";
import TrainerStudentGroupsResults from "../../components/trainer-students/groups/TrainerStudentGroupsResults";

const TrainerStudents = () => {
  const [display, setDisplay] = useState("students");
  const handleDisplay = (value: string) => {
    setDisplay(value);
  };
  const [textSearch, setTextSearch] = useState<string>("");
  const [playerLevelId, setPlayerLevelId] = useState<number | null>(null);
  const [gender, setGender] = useState<string>("");
  const [locationId, setLocationId] = useState<number | null>(null);
  const handleTextSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setTextSearch(event.target.value);
  };

  const handleGender = (event: ChangeEvent<HTMLSelectElement>) => {
    setGender(event.target.value);
  };

  const handleLevel = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setPlayerLevelId(isNaN(value) ? null : value);
  };
  const handleLocation = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setLocationId(isNaN(value) ? null : value);
  };

  const handleClear = () => {
    setTextSearch("");
    setPlayerLevelId(null);
    setGender("");
    setLocationId(null);
  };
  return (
    <div className={styles["students-container"]}>
      <TrainerStudentsNavigation
        display={display}
        handleDisplay={handleDisplay}
      />
      {display === "students" && (
        <TrainerStudentsResults
          textSearch={textSearch}
          playerLevelId={playerLevelId}
          locationId={locationId}
          gender={gender}
          handleLocation={handleLocation}
          handleClear={handleClear}
          handleTextSearch={handleTextSearch}
          handleLevel={handleLevel}
          handleGender={handleGender}
        />
      )}
      {display === "groups" && (
        <TrainerStudentGroupsResults
          textSearch={textSearch}
          handleTextSearch={handleTextSearch}
          handleClear={handleClear}
        />
      )}
      {display === "requests" && <TrainerStudentRequests />}
    </div>
  );
};

export default TrainerStudents;
