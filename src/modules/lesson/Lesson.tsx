import styles from "./styles.module.scss";

import LessonHero from "../../components/lesson/hero/LessonHero";
import LessonResults from "../../components/lesson/results/LessonResults";
import LessonSeach from "../../components/lesson/search/LessonsSearch";

const Lesson = () => {
  return (
    <div className={styles["lesson-container"]}>
      <LessonHero />
      <LessonSeach />
      <LessonResults />
    </div>
  );
};
export default Lesson;
