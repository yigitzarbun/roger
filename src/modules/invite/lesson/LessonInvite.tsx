import React from "react";

import LessonInviteForm from "../../../components/invite/lesson/form/LessonInviteForm";
import LessonInviteHero from "../../../components/invite/lesson/hero/LessonInviteHero";

import styles from "./styles.module.scss";

const LessonInvite = () => {
  return (
    <div className={styles["invite-container"]}>
      <LessonInviteHero />
      <LessonInviteForm />
    </div>
  );
};
export default LessonInvite;
