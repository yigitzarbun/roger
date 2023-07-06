import styles from "./styles.module.scss";

import PlayerRequets from "./player/PlayerRequets";

const Requests = () => {
  return (
    <div className={styles["requests-container"]}>
      <PlayerRequets />
    </div>
  );
};

export default Requests;
