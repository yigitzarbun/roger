import styles from "./styles.module.scss";

interface PlayerRequestsNavigationProps {
  display: string;
  handleDisplay: (value: string) => void;
}

const PlayerRequestsNavigation = ({
  display,
  handleDisplay,
}: PlayerRequestsNavigationProps) => {
  return (
    <div className={styles["nav-container"]}>
      <button
        onClick={() => handleDisplay("incoming")}
        className={
          display === "incoming"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        Gelen Davetler
      </button>
      <button
        onClick={() => handleDisplay("outgoing")}
        className={
          display === "outgoing"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        Gönderilen Davetler
      </button>
    </div>
  );
};

export default PlayerRequestsNavigation;
