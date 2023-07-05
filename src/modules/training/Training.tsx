import TrainingHero from "../../components/training/hero/TrainingHero";
import TrainSearch from "../../components/training/search/TrainSearch";
import TrainResults from "../../components/training/results/TrainResults";

import styles from "./styles.module.scss";

const Training = () => {
  return (
    <div className={styles["training-container"]}>
      <TrainingHero />
      <TrainSearch />
      <TrainResults />
    </div>
  );
};
export default Training;
