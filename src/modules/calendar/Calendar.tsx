import styles from "./styles.module.scss";
import PlayerCalendar from "./player/PlayerCalendar";

const Calendar = () => {
  return (
    <div className={styles["calendar-container"]}>
      <PlayerCalendar />
    </div>
  );
};
export default Calendar;
