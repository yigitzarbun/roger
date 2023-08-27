import React, { useState } from "react";

import styles from "./styles.module.scss";

import TrainerStudentsResults from "../../components/trainer-students/results/TrainerStudentsResults";
import TrainerStudentsHero from "../../components/trainer-students/hero/TrainerStudentsHero";
import TrainerStudentsNavigation from "../../components/trainer-students/navigation/TrainerStudentsNavigation";
import TrainerStudentRequests from "../../components/trainer-students/new-student-requests/TrainerStudentRequests";
import TrainerStudentGroupsResults from "../../components/trainer-students/groups/TrainerStudentGroupsResults";

const TrainerStudents = () => {
  const [display, setDisplay] = useState("students");
  const handleDisplay = (value: string) => {
    setDisplay(value);
  };

  return (
    <div className={styles["students-container"]}>
      <TrainerStudentsHero />
      <TrainerStudentsNavigation
        display={display}
        handleDisplay={handleDisplay}
      />
      {display === "students" && <TrainerStudentsResults />}
      {display === "groups" && <TrainerStudentGroupsResults />}
      {display === "requests" && <TrainerStudentRequests />}
    </div>
  );
};

export default TrainerStudents;
