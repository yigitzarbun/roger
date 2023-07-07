import PlayerCalendarHero from "../../../components/calendar/player/hero/PlayerCalendarHero";
import PlayerCalendarResults from "../../../components/calendar/player/results/PlayerCalendarResults";
import PlayerCalendarSearch from "../../../components/calendar/player/search/PlayerCalendarSearch";

import styles from "./styles.module.scss";

const PlayerCalendar = () => {
  return (
    <div className={styles["calendar-container"]}>
      <PlayerCalendarHero />
      <PlayerCalendarSearch />
      <PlayerCalendarResults />
    </div>
  );
};
export default PlayerCalendar;
